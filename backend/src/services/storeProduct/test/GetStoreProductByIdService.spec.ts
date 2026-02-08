import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetStoreProductByIdService } from '../GetStoreProductByIdService';

// Mock do Prisma Client
vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetStoreProductByIdService', () => {
    let service: GetStoreProductByIdService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetStoreProductByIdService();
    });

    it('should return store product details with product information', async () => {
        // Arrange
        const mockStoreProduct = {
            id: 'store-product-123',
            store_id: 'store-456',
            product_id: 'product-789',
            price: 29.99,
            stock: 100,
            enabled: true,
            visible_for_online_store: true,
            created_at: new Date('2025-01-01'),
            updated_at: new Date('2025-01-15'),
            product: {
                id: 'product-789',
                name: 'Produto Teste',
                unity: 'UN',
                description: 'Descrição do produto teste',
                image: 'https://example.com/image1.jpg',
                image_2: 'https://example.com/image2.jpg',
                image_3: 'https://example.com/image3.jpg',
                categories: [
                    {
                        category: {
                            id: 'cat-1',
                            name: 'Categoria 1',
                            slug: 'categoria-1',
                        },
                    },
                ],
            },
        };

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findUnique
            .mockResolvedValue(mockStoreProduct as any);

        // Act
        const result = await service.execute({ id: 'store-product-123' });

        // Assert
        expect(prismaClient.storeProduct.findUnique).toHaveBeenCalledWith({
            where: { id: 'store-product-123' },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        unity: true,
                        description: true,
                        image: true,
                        image_2: true,
                        image_3: true,
                        categories: {
                            include: {
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        expect(result).toEqual({
            id: 'store-product-123',
            store_id: 'store-456',
            product_id: 'product-789',
            price: 29.99,
            stock: 100,
            enabled: true,
            visible_for_online_store: true,
            product: {
                id: 'product-789',
                name: 'Produto Teste',
                unity: 'UN',
                description: 'Descrição do produto teste',
                image: 'https://example.com/image1.jpg',
                image_2: 'https://example.com/image2.jpg',
                image_3: 'https://example.com/image3.jpg',
                categories: [
                    {
                        category: {
                            id: 'cat-1',
                            name: 'Categoria 1',
                            slug: 'categoria-1',
                        },
                    },
                ],
            },
            created_at: mockStoreProduct.created_at,
            updated_at: mockStoreProduct.updated_at,
        });
    });

    it('should throw error when store product is not found', async () => {
        // Arrange
        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findUnique
            .mockResolvedValue(null);

        // Act & Assert
        await expect(service.execute({ id: 'non-existent-id' }))
            .rejects
            .toThrow('Store product not found');
    });

    it('should handle products with null images and description', async () => {
        // Arrange
        const mockStoreProduct = {
            id: 'store-product-123',
            store_id: 'store-456',
            product_id: 'product-789',
            price: 19.99,
            stock: 50,
            enabled: true,
            visible_for_online_store: false,
            created_at: new Date(),
            updated_at: new Date(),
            product: {
                id: 'product-789',
                name: 'Produto Sem Imagens',
                unity: 'KG',
                description: null,
                image: null,
                image_2: null,
                image_3: null,
                categories: [],
            },
        };

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findUnique
            .mockResolvedValue(mockStoreProduct as any);

        // Act
        const result = await service.execute({ id: 'store-product-123' });

        // Assert
        expect(result.product.description).toBeNull();
        expect(result.product.image).toBeNull();
        expect(result.product.image_2).toBeNull();
        expect(result.product.image_3).toBeNull();
        expect(result.product.categories).toEqual([]);
    });

    it('should return product with multiple categories', async () => {
        // Arrange
        const mockStoreProduct = {
            id: 'store-product-123',
            store_id: 'store-456',
            product_id: 'product-789',
            price: 39.99,
            stock: 75,
            enabled: true,
            visible_for_online_store: true,
            created_at: new Date(),
            updated_at: new Date(),
            product: {
                id: 'product-789',
                name: 'Produto Multi Categoria',
                unity: 'UN',
                description: 'Produto com múltiplas categorias',
                image: 'https://example.com/image.jpg',
                image_2: null,
                image_3: null,
                categories: [
                    {
                        category: {
                            id: 'cat-1',
                            name: 'Categoria 1',
                            slug: 'categoria-1',
                        },
                    },
                    {
                        category: {
                            id: 'cat-2',
                            name: 'Categoria 2',
                            slug: 'categoria-2',
                        },
                    },
                    {
                        category: {
                            id: 'cat-3',
                            name: 'Categoria 3',
                            slug: 'categoria-3',
                        },
                    },
                ],
            },
        };

        (prismaClient as DeepMockProxy<PrismaClient>)
            .storeProduct
            .findUnique
            .mockResolvedValue(mockStoreProduct as any);

        // Act
        const result = await service.execute({ id: 'store-product-123' });

        // Assert
        expect(result.product.categories).toHaveLength(3);
        expect(result.product.categories[0].category.name).toBe('Categoria 1');
        expect(result.product.categories[1].category.name).toBe('Categoria 2');
        expect(result.product.categories[2].category.name).toBe('Categoria 3');
    });
});
