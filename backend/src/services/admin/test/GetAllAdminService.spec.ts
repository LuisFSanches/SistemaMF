// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAllAdminService } from '../GetAllAdminService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAllAdminService', () => {
    let service: GetAllAdminService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetAllAdminService();
    });

    it('should get all admins', async () => {
        const mockAdmins = [
            {
                id: 'abc123',
                username: 'admin',
                name: 'Admin',
                password: 'password123',
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: 'def456',
                username: 'admin 2',
                name: 'Admin 2',
                password: 'password456',
                role: 'user',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).admin.findMany.mockResolvedValue(mockAdmins);
        (prismaClient as DeepMockProxy<PrismaClient>).admin.count.mockResolvedValue(1);

        const result = await service.execute();

        expect(prismaClient.admin.findMany).toHaveBeenCalledWith({
            select: {
                id: true,
                name: true,
                role: true,
                username: true,
            },
        });
        expect(result).toEqual({ admins: mockAdmins });
    });
});