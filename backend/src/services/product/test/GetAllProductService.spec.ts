import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAllProductService } from '../GetAllProductService';
import { ErrorCodes } from '../../../exceptions/root';
import { BadRequestException } from '../../../exceptions/bad-request';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAllProductService', () => {
    let service: GetAllProductService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetAllProductService();
    });

    it('should get all products with default pagination', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Product 1',
                image: 'image1.jpg',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 'def456',
                name: 'Product 2',
                image: 'image2.jpg',
                price: 19.99,
                unity: 'un',
                stock: 50,
                enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).product.findMany.mockResolvedValue(mockProducts);
        (prismaClient as DeepMockProxy<PrismaClient>).product.count.mockResolvedValue(2);

        const result = await service.execute();

        expect(prismaClient.product.findMany).toHaveBeenCalledWith({
            where: { enabled: true },
            skip: 0,
            take: 8,
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                unity: true,
                stock: true,
                enabled: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        expect(prismaClient.product.count).toHaveBeenCalledWith({
            where: { enabled: true }
        });
        expect(result).toEqual({
            products: mockProducts,
            total: 2,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should get products with custom pagination', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Product 1',
                image: 'image1.jpg',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).product.findMany.mockResolvedValue(mockProducts);
        (prismaClient as DeepMockProxy<PrismaClient>).product.count.mockResolvedValue(25);

        const result = await service.execute(3, 5);

        expect(prismaClient.product.findMany).toHaveBeenCalledWith({
            where: { enabled: true },
            skip: 10,
            take: 5,
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                unity: true,
                stock: true,
                enabled: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        expect(result).toEqual({
            products: mockProducts,
            total: 25,
            currentPage: 3,
            totalPages: 5
        });
    });

    it('should filter products by query string', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Apple Product',
                image: 'apple.jpg',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).product.findMany.mockResolvedValue(mockProducts);
        (prismaClient as DeepMockProxy<PrismaClient>).product.count.mockResolvedValue(1);

        const result = await service.execute(1, 8, 'Apple');

        expect(prismaClient.product.findMany).toHaveBeenCalledWith({
            where: {
                name: {
                    contains: 'Apple',
                    mode: 'insensitive'
                },
                enabled: true
            },
            skip: 0,
            take: 8,
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                unity: true,
                stock: true,
                enabled: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });
        expect(prismaClient.product.count).toHaveBeenCalledWith({
            where: {
                name: {
                    contains: 'Apple',
                    mode: 'insensitive'
                },
                enabled: true
            }
        });
        expect(result).toEqual({
            products: mockProducts,
            total: 1,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should return error object if Prisma throws an exception', async () => {
        const errorMessage = 'Database error';
        (prismaClient as DeepMockProxy<PrismaClient>).product.findMany.mockRejectedValue(new Error(errorMessage));

        try {
            await service.execute();
        } catch(error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(errorMessage);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.SYSTEM_ERROR);
            expect((error as BadRequestException).statusCode).toBe(400);
        }
    });

    it('should handle empty results', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).product.findMany.mockResolvedValue([]);
        (prismaClient as DeepMockProxy<PrismaClient>).product.count.mockResolvedValue(0);

        const result = await service.execute();

        expect(result).toEqual({
            products: [],
            total: 0,
            currentPage: 1,
            totalPages: 0
        });
    });

    it('should only return enabled products', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Enabled Product',
                image: 'enabled.jpg',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).product.findMany.mockResolvedValue(mockProducts);
        (prismaClient as DeepMockProxy<PrismaClient>).product.count.mockResolvedValue(1);

        const result = await service.execute();

        expect(prismaClient.product.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { enabled: true }
            })
        );
        expect(result.products).toEqual(mockProducts);
    });
});
