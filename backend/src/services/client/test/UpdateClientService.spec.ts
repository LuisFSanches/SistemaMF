// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateClientService } from '../UpdateClientService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('UpdateClientService', () => {
    let service: UpdateClientService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new UpdateClientService();
    });

    it('should update a client successfully', async () => {
        const mockUpdatedClient = {
            id: 'abc123',
            first_name: 'John Updated',
            last_name: 'Doe Updated',
            phone_number: '987654321',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).client.update.mockResolvedValue(mockUpdatedClient);

        const result = await service.execute({
            id: 'abc123',
            first_name: 'John Updated',
            last_name: 'Doe Updated',
            phone_number: '987654321'
        });

        expect(prismaClient.client.update).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            },
            data: {
                first_name: 'John Updated',
                last_name: 'Doe Updated',
                phone_number: '987654321'
            }
        });
        expect(result).toEqual(mockUpdatedClient);
    });

    it('should update client with partial data', async () => {
        const mockUpdatedClient = {
            id: 'abc123',
            first_name: 'John Updated',
            last_name: 'Doe',
            phone_number: '123456789',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).client.update.mockResolvedValue(mockUpdatedClient);

        const result = await service.execute({
            id: 'abc123',
            first_name: 'John Updated',
            last_name: 'Doe',
            phone_number: '123456789'
        });

        expect(prismaClient.client.update).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            },
            data: {
                first_name: 'John Updated',
                last_name: 'Doe',
                phone_number: '123456789'
            }
        });
        expect(result).toEqual(mockUpdatedClient);
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.update.mockRejectedValue(new Error('Database error'));

        const result = await service.execute({
            id: 'abc123',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '123456789'
        });

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle client not found error', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.update.mockRejectedValue(new Error('Record to update not found'));

        const result = await service.execute({
            id: 'nonexistent',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '123456789'
        });

        expect(result).toEqual({
            error: true,
            message: 'Record to update not found',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle unique constraint violation', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.update.mockRejectedValue(new Error('Unique constraint failed'));

        const result = await service.execute({
            id: 'abc123',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '123456789'
        });

        expect(result).toEqual({
            error: true,
            message: 'Unique constraint failed',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
