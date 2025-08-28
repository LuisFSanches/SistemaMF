import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateAdminService } from '../UpdateAdminService';
import { ErrorCodes } from '../../../exceptions/root';
import { BadRequestException } from '../../../exceptions/bad-request';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

vi.mock('bcrypt', () => ({
    hash: vi.fn()
}));

import prismaClient from '../../../prisma';
import { hash } from 'bcrypt';

describe('UpdateAdminService', () => {
    let service: UpdateAdminService;
    const mockHashedPassword = 'hashedPassword123';

    beforeEach(() => {
        vi.clearAllMocks();
        service = new UpdateAdminService();
        (hash as any).mockResolvedValue(mockHashedPassword);
    });

    it('should update an admin with password', async () => {
        const adminId = "abc123";
        const mockAdmin = {
            id: adminId,
            username: 'admin',
            name: 'Admin',
            password: mockHashedPassword,
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).admin.update.mockResolvedValue(mockAdmin);

        const adminInput = {
            id: adminId,
            username: 'admin',
            name: 'Admin',
            password: 'plainPassword123',
            role: 'admin'
        };

        const result = await service.execute(adminInput);

        expect(hash).toHaveBeenCalledWith('plainPassword123', 10);
        expect(prismaClient.admin.update).toHaveBeenCalledWith({
            where: {
                id: adminId
            }, 
            data: {
                username: 'admin',
                name: 'Admin',
                role: 'admin',
                password: mockHashedPassword
            }
        });
        expect(result).toEqual(mockAdmin);
    });

    it('should update an admin without password', async () => {
        const adminId = "abc123";
        const mockAdmin = {
            id: adminId,
            username: 'updatedAdmin',
            name: 'Updated Admin',
            password: 'existingPassword',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).admin.update.mockResolvedValue(mockAdmin);

        const adminInput = {
            id: adminId,
            username: 'updatedAdmin',
            name: 'Updated Admin',
            password: '',
            role: 'admin'
        };

        const result = await service.execute(adminInput);

        expect(hash).not.toHaveBeenCalled();
        expect(prismaClient.admin.update).toHaveBeenCalledWith({
            where: {
                id: adminId
            }, 
            data: {
                username: 'updatedAdmin',
                name: 'Updated Admin',
                role: 'admin'
            }
        });
        expect(result).toEqual(mockAdmin);
    });

    it('should handle database errors', async () => {
        const adminId = "abc123";
        const errorMessage = 'Database connection failed';

        (prismaClient as DeepMockProxy<PrismaClient>).admin.update.mockRejectedValue(new Error(errorMessage));

        const adminInput = {
            id: adminId,
            username: 'admin',
            name: 'Admin',
            password: 'plainPassword123',
            role: 'admin'
        };

        try {
            await service.execute(adminInput);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException);
            expect((error as BadRequestException).message).toBe(errorMessage);
            expect((error as BadRequestException).errorCode).toBe(ErrorCodes.SYSTEM_ERROR);
            expect((error as BadRequestException).statusCode).toBe(400);
        }
    });
});
