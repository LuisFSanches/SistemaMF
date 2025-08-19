import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteStockTransactionService } from '../DeleteStockTransactionService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('DeleteStockTransactionService', () => {
    let service: DeleteStockTransactionService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new DeleteStockTransactionService();
    });

    it('should delete a stock transaction successfully', async () => {
        const transactionId = 'abc123';
        const mockExistingTransaction = {
            id: transactionId,
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 100,
            unity_price: 10.50,
            total_price: 1050.00,
            purchased_date: new Date('2023-01-01'),
            created_at: new Date(),
            updated_at: new Date()
        };

        const mockDeletedTransaction = {
            ...mockExistingTransaction
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(mockExistingTransaction);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.delete.mockResolvedValue(mockDeletedTransaction);

        const result = await service.execute(transactionId);

        expect(prismaClient.stockTransaction.findUnique).toHaveBeenCalledWith({
            where: { id: transactionId }
        });
        expect(prismaClient.stockTransaction.delete).toHaveBeenCalledWith({
            where: { id: transactionId }
        });
        expect(result).toEqual(mockDeletedTransaction);
    });

    it('should return error when transaction not found', async () => {
        const transactionId = 'nonexistent';

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(null);

        const result = await service.execute(transactionId);

        expect(prismaClient.stockTransaction.findUnique).toHaveBeenCalledWith({
            where: { id: transactionId }
        });
        expect(prismaClient.stockTransaction.delete).not.toHaveBeenCalled();
        expect(result).toEqual({
            error: true,
            message: 'Transaction not found',
            code: ErrorCodes.USER_NOT_FOUND
        });
    });

    it('should return error object if findUnique throws an exception', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const transactionId = 'abc123';

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockRejectedValue(new Error('Database error'));

        const result = await service.execute(transactionId);

        expect(consoleSpy).toHaveBeenCalledWith('[DeleteStockTransactionService] Error:', 'Database error');
        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });

        consoleSpy.mockRestore();
    });

    it('should return error object if delete throws an exception', async () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        const transactionId = 'abc123';
        const mockExistingTransaction = {
            id: transactionId,
            product_id: 'product123',
            supplier: 'Test Supplier',
            unity: 'kg',
            quantity: 100,
            unity_price: 10.50,
            total_price: 1050.00,
            purchased_date: new Date('2023-01-01'),
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(mockExistingTransaction);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.delete.mockRejectedValue(new Error('Delete failed'));

        const result = await service.execute(transactionId);

        expect(consoleSpy).toHaveBeenCalledWith('[DeleteStockTransactionService] Error:', 'Delete failed');
        expect(result).toEqual({
            error: true,
            message: 'Delete failed',
            code: ErrorCodes.SYSTEM_ERROR
        });

        consoleSpy.mockRestore();
    });

    it('should handle empty transaction id', async () => {
        const transactionId = '';

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(null);

        const result = await service.execute(transactionId);

        expect(prismaClient.stockTransaction.findUnique).toHaveBeenCalledWith({
            where: { id: '' }
        });
        expect(result).toEqual({
            error: true,
            message: 'Transaction not found',
            code: ErrorCodes.USER_NOT_FOUND
        });
    });

    it('should handle null transaction id', async () => {
        const transactionId = null as any;

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(null);

        const result = await service.execute(transactionId);

        expect(prismaClient.stockTransaction.findUnique).toHaveBeenCalledWith({
            where: { id: null }
        });
        expect(result).toEqual({
            error: true,
            message: 'Transaction not found',
            code: ErrorCodes.USER_NOT_FOUND
        });
    });

    it('should delete transaction with different data types', async () => {
        const transactionId = 'def456';
        const mockExistingTransaction = {
            id: transactionId,
            product_id: 'product456',
            supplier: 'Another Supplier',
            unity: 'L',
            quantity: 25.5,
            unity_price: 8.75,
            total_price: 223.125,
            purchased_date: new Date('2023-02-15'),
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(mockExistingTransaction);
        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.delete.mockResolvedValue(mockExistingTransaction);

        const result = await service.execute(transactionId);

        expect(result).toEqual(mockExistingTransaction);
    });
});
