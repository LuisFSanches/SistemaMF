import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAllStockTransactionsService } from '../GetAllStockTransactionsService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAllStockTransactionsService', () => {
    let service: GetAllStockTransactionsService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetAllStockTransactionsService();
    });

    it('should get all stock transactions with default pagination', async () => {
        const mockTransactions = [
            {
                id: 'abc123',
                product_id: 'product123',
                supplier: 'Test Supplier',
                unity: 'kg',
                quantity: 100,
                unity_price: 10.50,
                total_price: 1050.00,
                purchased_date: new Date('2023-01-01'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product123',
                    name: 'Test Product',
                    price: 15.00,
                    unity: 'kg',
                    stock: 100,
                    enabled: true,
                    image: 'test.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            },
            {
                id: 'def456',
                product_id: 'product456',
                supplier: 'Another Supplier',
                unity: 'L',
                quantity: 50,
                unity_price: 5.25,
                total_price: 262.50,
                purchased_date: new Date('2023-01-02'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product456',
                    name: 'Another Product',
                    price: 8.00,
                    unity: 'L',
                    stock: 50,
                    enabled: true,
                    image: 'another.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue(mockTransactions);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(2);

        const result = await service.execute();

        expect(prismaClient.stockTransaction.findMany).toHaveBeenCalledWith({
            where: {},
            include: {
                product: true
            },
            orderBy: {
                purchased_date: 'desc'
            },
            skip: 0,
            take: 10
        });
        expect(prismaClient.stockTransaction.count).toHaveBeenCalledWith({
            where: {}
        });
        expect(result).toEqual({
            stockTransactions: mockTransactions,
            total: 2,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should get stock transactions with custom pagination', async () => {
        const mockTransactions = [
            {
                id: 'abc123',
                product_id: 'product123',
                supplier: 'Test Supplier',
                unity: 'kg',
                quantity: 100,
                unity_price: 10.50,
                total_price: 1050.00,
                purchased_date: new Date('2023-01-01'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product123',
                    name: 'Test Product',
                    price: 15.00,
                    unity: 'kg',
                    stock: 100,
                    enabled: true,
                    image: 'test.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue(mockTransactions);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(25);

        const result = await service.execute(3, 5);

        expect(prismaClient.stockTransaction.findMany).toHaveBeenCalledWith({
            where: {},
            include: {
                product: true
            },
            orderBy: {
                purchased_date: 'desc'
            },
            skip: 10,
            take: 5
        });
        expect(result).toEqual({
            stockTransactions: mockTransactions,
            total: 25,
            currentPage: 3,
            totalPages: 5
        });
    });

    it('should filter stock transactions by product name', async () => {
        const mockTransactions = [
            {
                id: 'abc123',
                product_id: 'product123',
                supplier: 'Test Supplier',
                unity: 'kg',
                quantity: 100,
                unity_price: 10.50,
                total_price: 1050.00,
                purchased_date: new Date('2023-01-01'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product123',
                    name: 'Apple Product',
                    price: 15.00,
                    unity: 'kg',
                    stock: 100,
                    enabled: true,
                    image: 'apple.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue(mockTransactions);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(1);

        const result = await service.execute(1, 10, 'Apple');

        expect(prismaClient.stockTransaction.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    {
                        product: {
                            name: {
                                contains: 'Apple',
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        supplier: {
                            contains: 'Apple',
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                product: true
            },
            orderBy: {
                purchased_date: 'desc'
            },
            skip: 0,
            take: 10
        });
        expect(result).toEqual({
            stockTransactions: mockTransactions,
            total: 1,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should filter stock transactions by supplier name', async () => {
        const mockTransactions = [
            {
                id: 'def456',
                product_id: 'product456',
                supplier: 'Apple Supplier',
                unity: 'L',
                quantity: 50,
                unity_price: 5.25,
                total_price: 262.50,
                purchased_date: new Date('2023-01-02'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product456',
                    name: 'Test Product',
                    price: 8.00,
                    unity: 'L',
                    stock: 50,
                    enabled: true,
                    image: 'test.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue(mockTransactions);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(1);

        const result = await service.execute(1, 10, 'Apple');

        expect(prismaClient.stockTransaction.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    {
                        product: {
                            name: {
                                contains: 'Apple',
                                mode: 'insensitive'
                            }
                        }
                    },
                    {
                        supplier: {
                            contains: 'Apple',
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                product: true
            },
            orderBy: {
                purchased_date: 'desc'
            },
            skip: 0,
            take: 10
        });
        expect(result).toEqual({
            stockTransactions: mockTransactions,
            total: 1,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should return error object if Prisma throws an exception', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockRejectedValue(new Error('Database error'));

        const result = await service.execute();

        expect(consoleSpy).toHaveBeenCalledWith('[GetAllStockTransactionsService] Error:', 'Database error');
        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });

        consoleSpy.mockRestore();
    });

    it('should handle empty results', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue([]);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(0);

        const result = await service.execute();

        expect(result).toEqual({
            stockTransactions: [],
            total: 0,
            currentPage: 1,
            totalPages: 0
        });
    });

    it('should order transactions by purchased_date desc', async () => {
        const mockTransactions = [
            {
                id: 'newer123',
                product_id: 'product123',
                supplier: 'Test Supplier',
                unity: 'kg',
                quantity: 100,
                unity_price: 10.50,
                total_price: 1050.00,
                purchased_date: new Date('2023-01-02'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product123',
                    name: 'Test Product',
                    price: 15.00,
                    unity: 'kg',
                    stock: 100,
                    enabled: true,
                    image: 'test.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue(mockTransactions);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(1);

        const result = await service.execute();

        expect(prismaClient.stockTransaction.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                orderBy: {
                    purchased_date: 'desc'
                }
            })
        );
        expect((result as any).stockTransactions).toEqual(mockTransactions);
    });

    it('should include product information in results', async () => {
        const mockTransactions = [
            {
                id: 'abc123',
                product_id: 'product123',
                supplier: 'Test Supplier',
                unity: 'kg',
                quantity: 100,
                unity_price: 10.50,
                total_price: 1050.00,
                purchased_date: new Date('2023-01-01'),
                created_at: new Date(),
                updated_at: new Date(),
                product: {
                    id: 'product123',
                    name: 'Test Product',
                    price: 15.00,
                    unity: 'kg',
                    stock: 100,
                    enabled: true,
                    image: 'test.jpg',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findMany.mockResolvedValue(mockTransactions);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.count.mockResolvedValue(1);

        const result = await service.execute();

        expect(prismaClient.stockTransaction.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                include: {
                    product: true
                }
            })
        );
        expect((result as any).stockTransactions[0].product).toBeDefined();
        expect((result as any).stockTransactions[0].product.name).toBe('Test Product');
    });
});
