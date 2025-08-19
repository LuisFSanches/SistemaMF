// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteAdminService } from '../DeleteAdminService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('DeleteAdminService', () => {
    let deleteAdminService: DeleteAdminService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(() => {
        vi.clearAllMocks();
        prisma = prismaClient as DeepMockProxy<PrismaClient>;
        deleteAdminService = new DeleteAdminService();
    });

    it('should delete an admin', async () => {
        const adminId = "abc123";
        const admin = {
            id: adminId,
            username: 'admin',
            name: 'Admin',
            password: 'password123',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        }
        prisma.admin.delete.mockResolvedValue(admin);

        const result = await deleteAdminService.execute(String(adminId));

        expect(prisma.admin.delete).toHaveBeenCalledWith({ where: { id: String(adminId) } });
        expect(result).toEqual({ Status: "Admin successfully deleted" });
    });

    it('should handle admin not found error', async () => {
        const adminId = 1;
        prisma.admin.delete.mockRejectedValue(new Error('Admin not found'));

        const result = await deleteAdminService.execute(String(adminId));

        expect(result).toEqual({
            error: true,
            message: 'Admin not found',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});