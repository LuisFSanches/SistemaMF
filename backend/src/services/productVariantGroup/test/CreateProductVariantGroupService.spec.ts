import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateProductVariantGroupService } from '../CreateProductVariantGroupService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

describe('CreateProductVariantGroupService', () => {
    let service: CreateProductVariantGroupService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new CreateProductVariantGroupService();
        prismaMock.$transaction.mockImplementation(async (callback: any) => callback(prismaMock));
    });

    it('should require a name', async () => {
        await expect(service.execute({ name: '' }))
            .rejects
            .toThrow('Group name is required');
    });

    it('should reject a duplicated group name', async () => {
        prismaMock.productVariantGroup.findFirst.mockResolvedValue({ id: 'g1', name: 'Buquê de 6 Rosas' } as any);

        await expect(service.execute({ name: 'buquê de 6 rosas' }))
            .rejects
            .toThrow('Variant group with this name already exists');
    });

    it('should create the group and attach its variants', async () => {
        const group = { id: 'g1', name: 'Buquê de 6 Rosas', products: [] };

        prismaMock.productVariantGroup.findFirst.mockResolvedValue(null);
        prismaMock.product.findMany.mockResolvedValue([{ id: 'p1', name: 'Vermelha', variant_group_id: null }] as any);
        prismaMock.productColor.findMany.mockResolvedValue([{ id: 'red' }] as any);
        prismaMock.productVariantGroup.create.mockResolvedValue(group as any);
        prismaMock.productVariantGroup.findUnique.mockResolvedValue(group as any);

        const result = await service.execute({
            name: 'Buquê de 6 Rosas',
            variants: [{ product_id: 'p1', color_id: 'red' }],
        });

        expect(prismaMock.productVariantGroup.create).toHaveBeenCalledWith({
            data: { name: 'Buquê de 6 Rosas', description: null },
        });
        expect(prismaMock.product.update).toHaveBeenCalledWith({
            where: { id: 'p1' },
            data: { variant_group_id: 'g1', color_id: 'red', variant_order: 0 },
        });
        expect(result).toEqual(group);
    });
});
