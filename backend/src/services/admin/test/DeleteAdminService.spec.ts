// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteAdminService } from '../DeleteAdminService';
import { ErrorCodes } from '../../../exceptions/root';
import { BadRequestException } from '../../../exceptions/bad-request';

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

    it('should delete an admin successfully', async () => {
        const adminId = "abc123";
        const admin = {
            id: adminId,
            username: 'admin',
            name: 'Admin',
            password: 'password123',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        };
        
        prisma.admin.delete.mockResolvedValue(admin);

        const result = await deleteAdminService.execute(adminId);

        expect(prisma.admin.delete).toHaveBeenCalledWith({ where: { id: adminId } });
        expect(result).toEqual({ Status: "Admin successfully deleted" });
    });

    it('should throw BadRequestException when admin is not found', async () => {
        const adminId = "nonexistent123";
        const errorMessage = 'Admin not found';
        
        prisma.admin.delete.mockRejectedValue(new Error(errorMessage));

        await expect(deleteAdminService.execute(adminId)).rejects.toThrow(BadRequestException);
        await expect(deleteAdminService.execute(adminId)).rejects.toThrow(errorMessage);
        
        expect(prisma.admin.delete).toHaveBeenCalledWith({ where: { id: adminId } });
    });

    it('should throw BadRequestException with correct error code when database error occurs', async () => {
        const adminId = "abc123";
        const errorMessage = 'Database connection failed';
        
        prisma.admin.delete.mockRejectedValue(new Error(errorMessage));

        try {
            await deleteAdminService.execute(adminId);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(errorMessage);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.SYSTEM_ERROR);
            expect((error as BadRequestException).statusCode).toBe(400);
        }
        
        expect(prisma.admin.delete).toHaveBeenCalledWith({ where: { id: adminId } });
    });
});
