import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { BadRequestException } from '../../../exceptions/bad-request';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

vi.mock('fs', () => ({
    default: { existsSync: vi.fn(() => true), unlinkSync: vi.fn(), mkdirSync: vi.fn() },
    existsSync: vi.fn(() => true),
    unlinkSync: vi.fn(),
    mkdirSync: vi.fn()
}));

const mockR2Delete = vi.fn().mockResolvedValue(undefined);
vi.mock('../../storage/CloudflareR2Service', () => ({
    CloudflareR2Service: vi.fn().mockImplementation(() => ({
        delete: mockR2Delete
    }))
}));

import prismaClient from '../../../prisma';
import { DeleteProduct3DModelService } from '../DeleteProduct3DModelService';

describe('DeleteProduct3DModelService', () => {
    let service: DeleteProduct3DModelService;

    beforeEach(() => {
        vi.clearAllMocks();
        mockR2Delete.mockResolvedValue(undefined);
        service = new DeleteProduct3DModelService();
    });

    it('should throw when there is no model to delete', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(null);

        await expect(service.execute('product-1')).rejects.toBeInstanceOf(BadRequestException);

        try {
            await service.execute('product-1');
        } catch (error) {
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.PRODUCT_3D_MODEL_NOT_FOUND);
        }
    });

    it('should delete the local model and remove the db record', async () => {
        const mockModel = {
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'http://localhost:3334/uploads/models3d/file.glb',
            original_filename: 'file.glb',
            file_size: 100,
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(mockModel);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.delete.mockResolvedValue(mockModel);

        const result = await service.execute('product-1');

        expect(prismaClient.product3DModel.delete).toHaveBeenCalledWith({
            where: { product_id: 'product-1' }
        });
        expect(result).toEqual({ success: true });
    });

    it('should wrap unexpected errors in BadRequestException', async () => {
        const mockModel = {
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'http://localhost:3334/uploads/models3d/file.glb',
            original_filename: 'file.glb',
            file_size: 100,
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(mockModel);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.delete.mockRejectedValue(new Error('DB error'));

        await expect(service.execute('product-1')).rejects.toBeInstanceOf(BadRequestException);
    });
});
