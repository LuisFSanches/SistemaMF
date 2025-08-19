import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateStockTransactionService } from '../CreateStockTransactionService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

vi.mock('moment-timezone', () => {
    const mockMoment = {
        utc: vi.fn().mockReturnThis(),
        tz: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        toDate: vi.fn(() => new Date('2023-01-01T12:00:00.000Z'))
    };
    
    const moment = Object.assign(vi.fn(() => mockMoment), {
        utc: vi.fn(() => mockMoment)
    });
    
    return {
        default: moment
    };
});

import prismaClient from '../../../prisma';

describe('CreateStockTransactionService', () => {
    let service: CreateStockTransactionService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new CreateStockTransactionService();
    });

    it('should create a stock transaction successfully', async () => {
        const mockCreatedTransaction = {
            id: 'abc123',
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 100,
            unity_price: 10.50,
            total_price: 1050.00,
            purchased_date: new Date('2023-01-01T12:00:00.000Z'),
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.create.mockResolvedValue(mockCreatedTransaction);

        const result = await service.execute({
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 100,
            unity_price: 10.50,
            total_price: 1050.00,
            purchased_date: new Date('2023-01-01')
        });

        expect(prismaClient.stockTransaction.create).toHaveBeenCalledWith({
            data: {
                product_id: 'product123',
                supplier: 'Test Supplier',
                unity: 'kg',
                quantity: 100,
                unity_price: 10.50,
                total_price: 1050.00,
                purchased_date: new Date('2023-01-01T12:00:00.000Z')
            }
        });
        expect(result).toEqual(mockCreatedTransaction);
    });

    it('should create a stock transaction with different unity', async () => {
        const mockCreatedTransaction = {
            id: 'def456',
            product_id: 'product456',
            supplier: 'Another Supplier',
            unity: 'L',
            quantity: 50,
            unity_price: 5.25,
            total_price: 262.50,
            purchased_date: new Date('2023-01-01T12:00:00.000Z'),
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.create.mockResolvedValue(mockCreatedTransaction);

        const result = await service.execute({
            product_id: 'product456',
            supplier: 'Another Supplier',
            unity: 'L',
            quantity: 50,
            unity_price: 5.25,
            total_price: 262.50,
            purchased_date: new Date('2023-01-01')
        });

        expect(result).toEqual(mockCreatedTransaction);
    });

    it('should return error object if Prisma throws an exception', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.create.mockRejectedValue(new Error('Database error'));

        const result = await service.execute({
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 100,
            unity_price: 10.50,
            total_price: 1050.00,
            purchased_date: new Date('2023-01-01')
        });

        expect(consoleSpy).toHaveBeenCalledWith('[CreateStockTransactionService] Error:', 'Database error');
        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });

        consoleSpy.mockRestore();
    });

    it('should handle foreign key constraint violation', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.create.mockRejectedValue(new Error('Foreign key constraint failed'));

        const result = await service.execute({
            product_id: 'nonexistent-product',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 100,
            unity_price: 10.50,
            total_price: 1050.00,
            purchased_date: new Date('2023-01-01')
        });

        expect(result).toEqual({
            error: true,
            message: 'Foreign key constraint failed',
            code: ErrorCodes.SYSTEM_ERROR
        });

        consoleSpy.mockRestore();
    });

    it('should handle zero quantity transaction', async () => {
        const mockCreatedTransaction = {
            id: 'zero123',
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 0,
            unity_price: 10.50,
            total_price: 0,
            purchased_date: new Date('2023-01-01T12:00:00.000Z'),
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.create.mockResolvedValue(mockCreatedTransaction);

        const result = await service.execute({
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 0,
            unity_price: 10.50,
            total_price: 0,
            purchased_date: new Date('2023-01-01')
        });

        expect(result).toEqual(mockCreatedTransaction);
    });

    it('should handle decimal values correctly', async () => {
        const mockCreatedTransaction = {
            id: 'decimal123',
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 15.5,
            unity_price: 12.75,
            total_price: 197.625,
            purchased_date: new Date('2023-01-01T12:00:00.000Z'),
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.create.mockResolvedValue(mockCreatedTransaction);

        const result = await service.execute({
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 15.5,
            unity_price: 12.75,
            total_price: 197.625,
            purchased_date: new Date('2023-01-01')
        });

        expect(result).toEqual(mockCreatedTransaction);
    });
});
