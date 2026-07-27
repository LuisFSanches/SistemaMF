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

const mockUploadFromPath = vi.fn().mockResolvedValue('https://r2.example.com/models3d/new-file.glb');
const mockR2Delete = vi.fn().mockResolvedValue(undefined);
vi.mock('../../storage/CloudflareR2Service', () => ({
    CloudflareR2Service: vi.fn().mockImplementation(() => ({
        uploadFromPath: mockUploadFromPath,
        delete: mockR2Delete
    }))
}));

import prismaClient from '../../../prisma';
import { CreateOrReplaceProduct3DModelService } from '../CreateOrReplaceProduct3DModelService';

describe('CreateOrReplaceProduct3DModelService', () => {
    let service: CreateOrReplaceProduct3DModelService;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUploadFromPath.mockResolvedValue('https://r2.example.com/models3d/new-file.glb');
        mockR2Delete.mockResolvedValue(undefined);
        process.env.USE_R2_STORAGE = 'true';
        process.env.R2_PUBLIC_URL = 'https://r2.example.com';
        service = new CreateOrReplaceProduct3DModelService();
    });

    it('should throw when the product does not exist', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.findFirst.mockResolvedValue(null);

        await expect(service.execute({
            product_id: 'missing-product',
            filename: 'hash-123.glb',
            originalname: 'chair.glb',
            size: 1000,
            mode: 'create'
        })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw PRODUCT_3D_MODEL_ALREADY_EXISTS when creating and a model already exists', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.findFirst.mockResolvedValue({ id: 'product-1' } as any);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue({
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'https://r2.example.com/models3d/old.glb',
            original_filename: 'old.glb',
            file_size: 500,
            created_at: new Date(),
            updated_at: new Date()
        });

        try {
            await service.execute({
                product_id: 'product-1',
                filename: 'hash-123.glb',
                originalname: 'chair.glb',
                size: 1000,
                mode: 'create'
            });
            expect.fail('should have thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.PRODUCT_3D_MODEL_ALREADY_EXISTS);
        }
    });

    it('should upload to R2 and create the record when none exists', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.findFirst.mockResolvedValue({ id: 'product-1' } as any);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(null);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.upsert.mockResolvedValue({
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'https://r2.example.com/models3d/new-file.glb',
            original_filename: 'chair.glb',
            file_size: 1000,
            created_at: new Date(),
            updated_at: new Date()
        });

        const result = await service.execute({
            product_id: 'product-1',
            filename: 'hash-123.glb',
            originalname: 'chair.glb',
            size: 1000,
            mode: 'create'
        });

        expect(mockUploadFromPath).toHaveBeenCalled();
        expect(mockR2Delete).not.toHaveBeenCalled();
        expect(prismaClient.product3DModel.upsert).toHaveBeenCalledWith({
            where: { product_id: 'product-1' },
            create: {
                product_id: 'product-1',
                model_url: 'https://r2.example.com/models3d/new-file.glb',
                original_filename: 'chair.glb',
                file_size: 1000
            },
            update: {
                model_url: 'https://r2.example.com/models3d/new-file.glb',
                original_filename: 'chair.glb',
                file_size: 1000
            }
        });
        expect(result.model_url).toBe('https://r2.example.com/models3d/new-file.glb');
    });

    it('should delete the old R2 file when replacing an existing model', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.findFirst.mockResolvedValue({ id: 'product-1' } as any);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue({
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'https://r2.example.com/models3d/old.glb',
            original_filename: 'old.glb',
            file_size: 500,
            created_at: new Date(),
            updated_at: new Date()
        });
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.upsert.mockResolvedValue({
            id: 'model-1',
            product_id: 'product-1',
            model_url: 'https://r2.example.com/models3d/new-file.glb',
            original_filename: 'chair.glb',
            file_size: 1000,
            created_at: new Date(),
            updated_at: new Date()
        });

        await service.execute({
            product_id: 'product-1',
            filename: 'hash-123.glb',
            originalname: 'chair.glb',
            size: 1000,
            mode: 'replace'
        });

        expect(mockR2Delete).toHaveBeenCalledWith({ fileUrl: 'https://r2.example.com/models3d/old.glb' });
    });

    it('should wrap unexpected errors in BadRequestException', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.findFirst.mockResolvedValue({ id: 'product-1' } as any);
        (prismaClient as DeepMockProxy<PrismaClient>).product3DModel.findUnique.mockResolvedValue(null);
        mockUploadFromPath.mockRejectedValue(new Error('R2 error'));

        await expect(service.execute({
            product_id: 'product-1',
            filename: 'hash-123.glb',
            originalname: 'chair.glb',
            size: 1000,
            mode: 'create'
        })).rejects.toBeInstanceOf(BadRequestException);
    });
});
