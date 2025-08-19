// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAdminService } from '../GetAdminService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAdminService', () => {
    let service: GetAdminService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetAdminService();
    });

    it('should get an admin', async () => {
        const adminId = "abc123";
        const mockAdmin = {
            id: 'abc123',
            username: 'admin',
            name: 'Admin',
            password: 'password123',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).admin.findFirst.mockResolvedValue(mockAdmin);

        const result = await service.execute(adminId);

        expect(prismaClient.admin.findFirst).toHaveBeenCalledWith({
            where: {
                id: adminId
            }
        });
        expect(result).toEqual(mockAdmin);
    });
});
