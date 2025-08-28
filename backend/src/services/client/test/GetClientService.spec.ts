// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetClientService } from '../GetClientService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetClientService', () => {
    let service: GetClientService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetClientService();
    });

    it('should get a client by id successfully', async () => {
        const mockClient = {
            id: 'abc123',
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '123456789',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).client.findFirst.mockResolvedValue(mockClient);

        const result = await service.execute('abc123');

        expect(prismaClient.client.findFirst).toHaveBeenCalledWith({
            where: {
                id: 'abc123'
            }
        });
        expect(result).toEqual({ user: mockClient });
    });

    it('should return user as null when client is not found', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.findFirst.mockResolvedValue(null);

        const result = await service.execute('nonexistent');

        expect(prismaClient.client.findFirst).toHaveBeenCalledWith({
            where: {
                id: 'nonexistent'
            }
        });
        expect(result).toEqual({ user: null });
    });

    it('should handle empty id parameter', async () => {
        const mockClient = null;

        (prismaClient as DeepMockProxy<PrismaClient>).client.findFirst.mockResolvedValue(mockClient);

        const result = await service.execute('');

        expect(prismaClient.client.findFirst).toHaveBeenCalledWith({
            where: {
                id: ''
            }
        });
        expect(result).toEqual({ user: null });
    });
});
