import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateProductService } from '../UpdateProductService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('UpdateProductService', () => {
    let service: UpdateProductService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new UpdateProductService();
    });

    it('should update a product successfully', async () => {
        const mockUpdatedProduct = {
            id: 'abc123',
            name: 'Updated Product',
            price: 39.99,
            unity: 'L',
            stock: 150,
            enabled: false,
            image: 'updated-image.jpg',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockResolvedValue(mockUpdatedProduct);

        const result = await service.execute({
            id: 'abc123',
            name: 'Updated Product',
            price: 39.99,
            unity: 'L',
            stock: 150,
            enabled: false,
            image: 'updated-image.jpg'
        });

        expect(prismaClient.product.update).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            },
            data: {
                name: 'Updated Product',
                price: 39.99,
                unity: 'L',
                stock: 150,
                enabled: false,
                image: 'updated-image.jpg'
            }
        });
        expect(result).toEqual(mockUpdatedProduct);
    });

    it('should update product with partial data', async () => {
        const mockUpdatedProduct = {
            id: 'abc123',
            name: 'Partially Updated Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true,
            image: null,
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockResolvedValue(mockUpdatedProduct);

        const result = await service.execute({
            id: 'abc123',
            name: 'Partially Updated Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true
        });

        expect(prismaClient.product.update).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            },
            data: {
                name: 'Partially Updated Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                image: undefined
            }
        });
        expect(result).toEqual(mockUpdatedProduct);
    });

    it('should update product enabling/disabling it', async () => {
        const mockUpdatedProduct = {
            id: 'abc123',
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: false,
            image: 'test.jpg',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockResolvedValue(mockUpdatedProduct);

        const result = await service.execute({
            id: 'abc123',
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: false,
            image: 'test.jpg'
        });

        expect(prismaClient.product.update).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            },
            data: {
                name: 'Test Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: false,
                image: 'test.jpg'
            }
        });
        expect(result).toEqual(mockUpdatedProduct);
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockRejectedValue(new Error('Database error'));

        const result = await service.execute({
            id: 'abc123',
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

    it('should handle product not found error', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockRejectedValue(new Error('Record to update not found'));

        const result = await service.execute({
            id: 'nonexistent',
            name: 'Test Product',
            price: 29.99,
            unity: 'kg',
            stock: 100,
            enabled: true
        });

        expect(result).toEqual({
            error: true,
            message: 'Record to update not found',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle unique constraint violation', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockRejectedValue(new Error('Unique constraint failed'));

        const result = await service.execute({
            id: 'abc123',
            name: 'Duplicate Product Name',
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

    it('should update stock to zero', async () => {
        const mockUpdatedProduct = {
            id: 'abc123',
            name: 'Out of Stock Product',
            price: 29.99,
            unity: 'kg',
            stock: 0,
            enabled: true,
            image: 'test.jpg',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockResolvedValue(mockUpdatedProduct);

        const result = await service.execute({
            id: 'abc123',
            name: 'Out of Stock Product',
            price: 29.99,
            unity: 'kg',
            stock: 0,
            enabled: true,
            image: 'test.jpg'
        });

        expect(prismaClient.product.update).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            },
            data: {
                name: 'Out of Stock Product',
                price: 29.99,
                unity: 'kg',
                stock: 0,
                enabled: true,
                image: 'test.jpg'
            }
        });
        expect(result).toEqual(mockUpdatedProduct);
    });
});
