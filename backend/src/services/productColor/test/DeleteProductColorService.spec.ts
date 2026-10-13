import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteProductColorService } from '../DeleteProductColorService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

describe('DeleteProductColorService', () => {
    let service: DeleteProductColorService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new DeleteProductColorService();
    });

    it('should not delete a color used by products', async () => {
        prismaMock.productColor.findUnique.mockResolvedValue({ id: 'red', _count: { products: 3 } } as any);

        await expect(service.execute({ id: 'red' }))
            .rejects
            .toThrow('Cannot delete color used by 3 products');
        expect(prismaMock.productColor.delete).not.toHaveBeenCalled();
    });

    it('should delete an unused color', async () => {
        prismaMock.productColor.findUnique.mockResolvedValue({ id: 'red', _count: { products: 0 } } as any);

        const result = await service.execute({ id: 'red' });

        expect(prismaMock.productColor.delete).toHaveBeenCalledWith({ where: { id: 'red' } });
        expect(result).toEqual({ message: "Color deleted successfully" });
    });
});
