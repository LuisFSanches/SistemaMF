// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetClientByPhoneNumberService } from '../GetClientByPhoneNumberService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetClientByPhoneNumberService', () => {
    let service: GetClientByPhoneNumberService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetClientByPhoneNumberService();
    });

    it('should find a client by phone number successfully', async () => {
        const mockClient = {
            id: 'abc123',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '123456789',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).client.findFirst.mockResolvedValue(mockClient);

        const result = await service.execute('123456789');

        expect(prismaClient.client.findFirst).toHaveBeenCalledWith({
            where: {
                phone_number: '123456789'
            }
        });
        expect(result).toEqual(mockClient);
    });

    it('should return null when client is not found', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.findFirst.mockResolvedValue(null);

        const result = await service.execute('999999999');

        expect(prismaClient.client.findFirst).toHaveBeenCalledWith({
            where: {
                phone_number: '999999999'
            }
        });
        expect(result).toBeNull();
    });

    it('should return null when phone_number is empty', async () => {
        const result = await service.execute('');

        expect(prismaClient.client.findFirst).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('should return null when phone_number is undefined', async () => {
        const result = await service.execute(undefined as any);

        expect(prismaClient.client.findFirst).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('should return null when phone_number is null', async () => {
        const result = await service.execute(null as any);

        expect(prismaClient.client.findFirst).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.findFirst.mockRejectedValue(new Error('Database error'));

        const result = await service.execute('123456789');

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
