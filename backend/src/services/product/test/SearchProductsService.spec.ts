import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { SearchProductsService } from '../SearchProductsService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('SearchProductsService', () => {
    let service: SearchProductsService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new SearchProductsService();
    });

    it('should search products successfully', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Apple Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                image: 'apple.jpg',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 'def456',
                name: 'Apple Juice',
                price: 15.99,
                unity: 'L',
                stock: 50,
                enabled: true,
                image: 'apple-juice.jpg',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).$queryRawUnsafe.mockResolvedValue(mockProducts);

        const result = await service.execute('Apple');

        expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledWith(
            `
                SELECT * FROM "products"
                WHERE enabled = true
                AND unaccent(lower(name)) LIKE '%' || unaccent(lower($1)) || '%'
                ORDER BY name
                LIMIT 50
            `,
            'Apple'
        );
        expect(result).toEqual(mockProducts);
    });

    it('should return empty array when query is empty', async () => {
        const result = await service.execute('');

        expect(prismaClient.$queryRawUnsafe).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should return empty array when query is null', async () => {
        const result = await service.execute(null as any);

        expect(prismaClient.$queryRawUnsafe).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should return empty array when query is undefined', async () => {
        const result = await service.execute(undefined as any);

        expect(prismaClient.$queryRawUnsafe).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should handle case-insensitive search', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'APPLE Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                image: 'apple.jpg',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).$queryRawUnsafe.mockResolvedValue(mockProducts);

        const result = await service.execute('apple');

        expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledWith(
            expect.stringContaining('unaccent(lower(name)) LIKE'),
            'apple'
        );
        expect(result).toEqual(mockProducts);
    });

    it('should handle accent-insensitive search', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Açaí Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                image: 'acai.jpg',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).$queryRawUnsafe.mockResolvedValue(mockProducts);

        const result = await service.execute('acai');

        expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledWith(
            expect.stringContaining('unaccent(lower($1))'),
            'acai'
        );
        expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products match', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).$queryRawUnsafe.mockResolvedValue([]);

        const result = await service.execute('nonexistent');

        expect(result).toEqual([]);
    });

    it('should limit results to 50 products', async () => {
        const mockProducts = Array.from({ length: 50 }, (_, i) => ({
            id: `product${i}`,
            name: `Product ${i}`,
            price: 10.99,
            unity: 'un',
            stock: 10,
            enabled: true,
            image: `product${i}.jpg`,
            created_at: new Date(),
            updated_at: new Date()
        }));

        (prismaClient as DeepMockProxy<PrismaClient>).$queryRawUnsafe.mockResolvedValue(mockProducts);

        const result = await service.execute('Product');

        expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledWith(
            expect.stringContaining('LIMIT 50'),
            'Product'
        );
        expect(result).toHaveLength(50);
    });

    it('should only return enabled products', async () => {
        const mockProducts = [
            {
                id: 'abc123',
                name: 'Enabled Product',
                price: 29.99,
                unity: 'kg',
                stock: 100,
                enabled: true,
                image: 'enabled.jpg',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).$queryRawUnsafe.mockResolvedValue(mockProducts);

        const result = await service.execute('Product');

        expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledWith(
            expect.stringContaining('WHERE enabled = true'),
            'Product'
        );
        expect(result).toEqual(mockProducts);
    });
});
