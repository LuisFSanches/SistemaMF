import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { SetProductVariantsService } from '../SetProductVariantsService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

describe('SetProductVariantsService', () => {
    let service: SetProductVariantsService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new SetProductVariantsService();
        // Run the interactive transaction callback against the same mock
        prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
    });

    it('should throw when the group does not exist', async () => {
        prismaMock.productVariantGroup.findUnique.mockResolvedValue(null);

        await expect(service.execute({ group_id: 'g1', variants: [] }))
            .rejects
            .toThrow('Variant group not found');
    });

    it('should reject the same color twice in a group', async () => {
        prismaMock.productVariantGroup.findUnique.mockResolvedValue({ id: 'g1' } as any);

        await expect(service.execute({
            group_id: 'g1',
            variants: [
                { product_id: 'p1', color_id: 'red' },
                { product_id: 'p2', color_id: 'red' },
            ]
        })).rejects.toThrow('Each color can only be used once per group');
    });

    it('should reject a product that belongs to another group', async () => {
        prismaMock.productVariantGroup.findUnique.mockResolvedValue({ id: 'g1' } as any);
        prismaMock.product.findMany.mockResolvedValue([
            { id: 'p1', name: 'Buquê de 6 Rosas | Cor: Vermelha', variant_group_id: 'other-group' },
        ] as any);
        prismaMock.productColor.findMany.mockResolvedValue([{ id: 'red' }] as any);

        await expect(service.execute({
            group_id: 'g1',
            variants: [{ product_id: 'p1', color_id: 'red' }]
        })).rejects.toThrow('already belongs to another variant group');
    });

    it('should reject unknown colors', async () => {
        prismaMock.productVariantGroup.findUnique.mockResolvedValue({ id: 'g1' } as any);
        prismaMock.product.findMany.mockResolvedValue([
            { id: 'p1', name: 'A', variant_group_id: null },
        ] as any);
        prismaMock.productColor.findMany.mockResolvedValue([]);

        await expect(service.execute({
            group_id: 'g1',
            variants: [{ product_id: 'p1', color_id: 'missing' }]
        })).rejects.toThrow('One or more colors were not found');
    });

    it('should detach current members and attach the new list in order', async () => {
        prismaMock.productVariantGroup.findUnique.mockResolvedValue({ id: 'g1', products: [] } as any);
        prismaMock.product.findMany.mockResolvedValue([
            { id: 'p1', name: 'Vermelha', variant_group_id: 'g1' },
            { id: 'p2', name: 'Rosa', variant_group_id: null },
        ] as any);
        prismaMock.productColor.findMany.mockResolvedValue([{ id: 'red' }, { id: 'pink' }] as any);

        await service.execute({
            group_id: 'g1',
            variants: [
                { product_id: 'p1', color_id: 'red' },
                { product_id: 'p2', color_id: 'pink' },
            ]
        });

        expect(prismaMock.product.updateMany).toHaveBeenCalledWith({
            where: { variant_group_id: 'g1' },
            data: { variant_group_id: null, color_id: null, variant_order: 0 },
        });
        expect(prismaMock.product.update).toHaveBeenNthCalledWith(1, {
            where: { id: 'p1' },
            data: { variant_group_id: 'g1', color_id: 'red', variant_order: 0 },
        });
        expect(prismaMock.product.update).toHaveBeenNthCalledWith(2, {
            where: { id: 'p2' },
            data: { variant_group_id: 'g1', color_id: 'pink', variant_order: 1 },
        });
    });
});
