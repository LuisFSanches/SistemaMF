// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAllClientService } from '../GetAllClientService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAllClientService', () => {
    let service: GetAllClientService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetAllClientService();
    });

    it('should get all clients with default pagination', async () => {
        const mockClients = [
            {
                id: 'abc123',
                first_name: 'John',
                last_name: 'Doe',
                phone_number: '123456789',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 'def456',
                first_name: 'Jane',
                last_name: 'Smith',
                phone_number: '987654321',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).client.findMany.mockResolvedValue(mockClients);
        (prismaClient as DeepMockProxy<PrismaClient>).client.count.mockResolvedValue(2);

        const result = await service.execute();

        expect(prismaClient.client.findMany).toHaveBeenCalledWith({
            where: {},
            skip: 0,
            take: 10
        });
        expect(prismaClient.client.count).toHaveBeenCalled();
        expect(result).toEqual({
            users: mockClients,
            total: 2,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should get clients with custom pagination', async () => {
        const mockClients = [
            {
                id: 'abc123',
                first_name: 'John',
                last_name: 'Doe',
                phone_number: '123456789',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).client.findMany.mockResolvedValue(mockClients);
        (prismaClient as DeepMockProxy<PrismaClient>).client.count.mockResolvedValue(25);

        const result = await service.execute(3, 5);

        expect(prismaClient.client.findMany).toHaveBeenCalledWith({
            where: {},
            skip: 10,
            take: 5
        });
        expect(result).toEqual({
            users: mockClients,
            total: 25,
            currentPage: 3,
            totalPages: 5
        });
    });

    it('should filter clients by query string', async () => {
        const mockClients = [
            {
                id: 'abc123',
                first_name: 'John',
                last_name: 'Doe',
                phone_number: '123456789',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).client.findMany.mockResolvedValue(mockClients);
        (prismaClient as DeepMockProxy<PrismaClient>).client.count.mockResolvedValue(1);

        const result = await service.execute(1, 10, 'John');

        expect(prismaClient.client.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                    { first_name: { contains: 'John', mode: 'insensitive' } },
                    { last_name: { contains: 'John', mode: 'insensitive' } },
                    { phone_number: { contains: 'John', mode: 'insensitive' } }
                ]
            },
            skip: 0,
            take: 10
        });
        expect(result).toEqual({
            users: mockClients,
            total: 1,
            currentPage: 1,
            totalPages: 1
        });
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.findMany.mockRejectedValue(new Error('Database error'));

        const result = await service.execute();

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle empty results', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).client.findMany.mockResolvedValue([]);
        (prismaClient as DeepMockProxy<PrismaClient>).client.count.mockResolvedValue(0);

        const result = await service.execute();

        expect(result).toEqual({
            users: [],
            total: 0,
            currentPage: 1,
            totalPages: 0
        });
    });
});
