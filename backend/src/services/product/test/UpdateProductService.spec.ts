import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateProductService } from '../UpdateProductService';
import { ErrorCodes } from '../../../exceptions/root';
import { BadRequestException } from '../../../exceptions/bad-request';

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
        const errorMessage = 'Database error';
        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockRejectedValue(new Error(errorMessage));
        try {
            await service.execute({
                id: 'abc123',
                name: 'Test Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true
            });
        } catch(error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(errorMessage);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.SYSTEM_ERROR);
            expect((error as BadRequestException).statusCode).toBe(400);
        }
    });

    it('should handle product not found error', async () => {
        const errorMessage = 'Record to update not found';
        (prismaClient as DeepMockProxy<PrismaClient>).product.update.mockRejectedValue(new Error(errorMessage));
        try {
            await service.execute({
                id: 'nonexistent',
                name: 'Test Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true
            });
        } catch(error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(errorMessage);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.SYSTEM_ERROR);
            expect((error as BadRequestException).statusCode).toBe(400);
        }
    });
});
