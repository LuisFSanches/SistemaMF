import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateProductService } from '../CreateProductService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('CreateProductService', () => {
    let service: CreateProductService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new CreateProductService();
    });

    it('should create a product successfully', async () => {
        const mockCreatedProduct = {
            id: 'abc123',
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true,
            image: 'test-image.jpg',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product.create.mockResolvedValue(mockCreatedProduct);

        const result = await service.execute({
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true,
            image: 'test-image.jpg'
        });

        expect(prismaClient.product.create).toHaveBeenCalledWith({
            data: {
                name: 'Test Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                image: 'test-image.jpg'
            }
        });
        expect(result).toEqual(mockCreatedProduct);
    });

    it('should create a product without optional fields', async () => {
        const mockCreatedProduct = {
            id: 'abc123',
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true,
            image: null,
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product.create.mockResolvedValue(mockCreatedProduct);

        const result = await service.execute({
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true
        });

        expect(prismaClient.product.create).toHaveBeenCalledWith({
            data: {
                name: 'Test Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true
            }
        });
        expect(result).toEqual(mockCreatedProduct);
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.create.mockRejectedValue(new Error('Database error'));

        const result = await service.execute({
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true
        });

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle unique constraint violation', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.create.mockRejectedValue(new Error('Unique constraint failed'));

        const result = await service.execute({
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true
        });

        expect(result).toEqual({
            error: true,
            message: 'Unique constraint failed',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
