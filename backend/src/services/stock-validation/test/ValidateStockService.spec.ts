import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { ValidateStockService } from '../ValidateStockService';

// Mock do Prisma Client
vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('ValidateStockService', () => {
    let service: ValidateStockService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new ValidateStockService();
    });

    it('should return valid when all products have sufficient stock', async () => {
        // Arrange
        const requestData = {
            items: [
                { store_product_id: 'product-1', quantity: 2 },
                { store_product_id: 'product-2', quantity: 5 }
            ]
        };

        const mockStoreProducts = [
            {
                id: 'product-1',
                stock: 10,
                enabled: true,
                visible_for_online_store: true,
                product: { name: 'Rosas Vermelhas' }
            },
            {
                id: 'product-2',
                stock: 20,
                enabled: true,
                visible_for_online_store: true,
                product: { name: 'Orquídeas Brancas' }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findMany
            .mockResolvedValue(mockStoreProducts as any);

        // Act
        const result = await service.execute(requestData);

        // Assert
        expect(prismaClient.storeProduct.findMany).toHaveBeenCalledWith({
            where: {
                id: {
                    in: ['product-1', 'product-2']
                }
            },
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            }
        });
        expect(result.is_valid).toBe(true);
        expect(result.invalid_items).toHaveLength(0);
        expect(result.message).toBe('Todos os produtos têm estoque disponível');
    });

    it('should return invalid when product has insufficient stock', async () => {
        // Arrange
        const requestData = {
            items: [
                { store_product_id: 'product-1', quantity: 15 }
            ]
        };

        const mockStoreProducts = [
            {
                id: 'product-1',
                stock: 5,
                enabled: true,
                visible_for_online_store: true,
                product: { name: 'Rosas Vermelhas' }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findMany
            .mockResolvedValue(mockStoreProducts as any);

        // Act
        const result = await service.execute(requestData);

        // Assert
        expect(result.is_valid).toBe(false);
        expect(result.invalid_items).toHaveLength(1);
        expect(result.invalid_items[0]).toMatchObject({
            store_product_id: 'product-1',
            product_name: 'Rosas Vermelhas',
            requested_quantity: 15,
            available_stock: 5,
            has_stock: false,
            is_enabled: true,
            is_visible: true
        });
    });

    it('should return invalid when product is disabled', async () => {
        // Arrange
        const requestData = {
            items: [
                { store_product_id: 'product-1', quantity: 5 }
            ]
        };

        const mockStoreProducts = [
            {
                id: 'product-1',
                stock: 10,
                enabled: false,
                visible_for_online_store: true,
                product: { name: 'Rosas Vermelhas' }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findMany
            .mockResolvedValue(mockStoreProducts as any);

        // Act
        const result = await service.execute(requestData);

        // Assert
        expect(result.is_valid).toBe(false);
        expect(result.invalid_items).toHaveLength(1);
        expect(result.invalid_items[0].is_enabled).toBe(false);
    });

    it('should return invalid when product is not visible for online store', async () => {
        // Arrange
        const requestData = {
            items: [
                { store_product_id: 'product-1', quantity: 2 }
            ]
        };

        const mockStoreProducts = [
            {
                id: 'product-1',
                stock: 10,
                enabled: true,
                visible_for_online_store: false,
                product: { name: 'Rosas Vermelhas' }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findMany
            .mockResolvedValue(mockStoreProducts as any);

        // Act
        const result = await service.execute(requestData);

        // Assert
        expect(result.is_valid).toBe(false);
        expect(result.invalid_items).toHaveLength(1);
        expect(result.invalid_items[0].is_visible).toBe(false);
    });

    it('should return invalid when product is not found', async () => {
        // Arrange
        const requestData = {
            items: [
                { store_product_id: 'non-existent-product', quantity: 1 }
            ]
        };

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findMany
            .mockResolvedValue([]);

        // Act
        const result = await service.execute(requestData);

        // Assert
        expect(result.is_valid).toBe(false);
        expect(result.invalid_items).toHaveLength(1);
        expect(result.invalid_items[0]).toMatchObject({
            store_product_id: 'non-existent-product',
            product_name: 'Produto não encontrado',
            has_stock: false,
            is_enabled: false,
            is_visible: false
        });
    });

    it('should throw error when validation fails (empty items)', async () => {
        // Arrange
        const invalidData = {
            items: []
        };

        // Act & Assert
        await expect(service.execute(invalidData))
            .rejects
            .toThrow('items array must contain at least one item');
    });

    it('should throw error when validation fails (invalid quantity)', async () => {
        // Arrange
        const invalidData = {
            items: [
                { store_product_id: 'product-1', quantity: -5 }
            ]
        };

        // Act & Assert
        await expect(service.execute(invalidData))
            .rejects
            .toThrow();
    });

    it('should handle multiple invalid items correctly', async () => {
        // Arrange
        const requestData = {
            items: [
                { store_product_id: 'product-1', quantity: 15 },
                { store_product_id: 'product-2', quantity: 5 },
                { store_product_id: 'product-3', quantity: 3 }
            ]
        };

        const mockStoreProducts = [
            {
                id: 'product-1',
                stock: 5,
                enabled: true,
                visible_for_online_store: true,
                product: { name: 'Produto 1' }
            },
            {
                id: 'product-2',
                stock: 10,
                enabled: false,
                visible_for_online_store: true,
                product: { name: 'Produto 2' }
            },
            {
                id: 'product-3',
                stock: 20,
                enabled: true,
                visible_for_online_store: false,
                product: { name: 'Produto 3' }
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findMany
            .mockResolvedValue(mockStoreProducts as any);

        // Act
        const result = await service.execute(requestData);

        // Assert
        expect(result.is_valid).toBe(false);
        expect(result.invalid_items).toHaveLength(3);
    });
});
