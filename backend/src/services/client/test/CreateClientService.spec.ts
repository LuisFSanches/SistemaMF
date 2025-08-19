// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateClientService } from '../CreateClientService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('CreateClientService', () => {
    let service: CreateClientService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new CreateClientService();
    });

    it('should create a client successfully', async () => {
        const mockCreatedClient = {
            id: 'abc123',
            first_name: 'John Doe',
            last_name: 'Doe',
            phone_number: '123456789',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).client.create.mockResolvedValue(mockCreatedClient);

        const result = await service.execute({
            first_name: 'John Doe',
            last_name: 'Doe',
            phone_number: '123456789'
        });

        expect(prismaClient.client.create).toHaveBeenCalledWith({
            data: {
                first_name: 'John Doe',
                last_name: 'Doe',
                phone_number: '123456789'
            }
        });
        expect(result).toEqual(mockCreatedClient);
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.create.mockRejectedValue(new Error('Database error'));

        const result = await service.execute({
            first_name: 'John Doe',
            last_name: 'Doe',
            phone_number: '123456789'
        });

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
