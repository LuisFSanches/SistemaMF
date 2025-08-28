import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteStockTransactionService } from '../DeleteStockTransactionService';
import { ErrorCodes } from '../../../exceptions/root';
import { BadRequestException } from '../../../exceptions/bad-request';

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
        const errorMessage = 'Transaction not found';

        (prismaClient as DeepMockProxy<PrismaClient>).stockTransaction.findUnique.mockResolvedValue(null);

        try {
            await service.execute(transactionId);
        } catch(error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(errorMessage);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.SYSTEM_ERROR);
            expect((error as BadRequestException).statusCode).toBe(400);
        }
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
