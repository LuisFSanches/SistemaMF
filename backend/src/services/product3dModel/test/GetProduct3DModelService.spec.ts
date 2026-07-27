import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetProduct3DModelService } from '../GetProduct3DModelService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetProduct3DModelService', () => {
    let service: GetProduct3DModelService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetProduct3DModelService();
    });

    it('should return the 3d model for a product', async () => {
        const mockModel = {
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'https://r2.example.com/models3d/file.glb',
            original_filename: 'file.glb',
            file_size: 12345,
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(mockModel);

        const result = await service.execute('product-1');

        expect(prismaClient.product3DModel.findUnique).toHaveBeenCalledWith({
            where: { product_id: 'product-1' }
        });
        expect(result).toEqual(mockModel);
    });

    it('should return null when the product has no 3d model', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(null);

        const result = await service.execute('product-1');

        expect(result).toBeNull();
    });
});
