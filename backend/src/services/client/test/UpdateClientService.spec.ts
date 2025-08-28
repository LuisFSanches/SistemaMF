// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateClientService } from '../UpdateClientService';

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
});
