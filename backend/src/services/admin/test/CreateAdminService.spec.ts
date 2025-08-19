// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateAdminService } from '../CreateAdminService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

vi.mock('bcrypt', () => ({
    hash: vi.fn()
}));

import prismaClient from '../../../prisma';
import { hash } from 'bcrypt';

describe('CreateAdminService', () => {
    let createAdminService: CreateAdminService;
    let prismaClientMock: DeepMockProxy<PrismaClient>;
    const mockHashedPassword = 'hashedPassword123';

    beforeEach(() => {
        vi.clearAllMocks();
        prismaClientMock = prismaClient as DeepMockProxy<PrismaClient>;
        createAdminService = new CreateAdminService();
        (hash as any).mockResolvedValue(mockHashedPassword);
    });

    it('should create admin', async () => {
        const adminInput = {
            username: 'admin',
            name: 'Admin',
            password: 'password123',
            role: 'admin'
        };

        const mockCreatedAdmin = {
            id: 'abc123',
            username: 'admin',
            name: 'Admin',
            password: mockHashedPassword,
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        };

        prismaClientMock.admin.findFirst.mockResolvedValue(null);
        prismaClientMock.admin.create.mockResolvedValue(mockCreatedAdmin);

        const result = await createAdminService.execute(adminInput);

        expect(hash).toHaveBeenCalledWith('password123', 10);
        expect(prismaClientMock.admin.findFirst).toHaveBeenCalledWith({
            where: {
                username: 'admin'
            }
        });
        expect(prismaClientMock.admin.create).toHaveBeenCalledWith({
            data: {
                username: 'admin',
                name: 'Admin',
                password: mockHashedPassword,
                role: 'admin'
            }
        });
        expect(result).toEqual(mockCreatedAdmin);
    });

    it('should return error if admin already exists', async () => {
        const adminInput = {
            username: 'admin',
            name: 'Admin',
            password: 'password123',
            role: 'admin'
        };

        const existingAdmin = {
            id: 'existing123',
            username: 'admin',
            name: 'Existing Admin',
            password: 'existingHashedPassword',
            role: 'admin',
            created_at: new Date(),
            updated_at: new Date()
        };

        prismaClientMock.admin.findFirst.mockResolvedValue(existingAdmin);

        const result = await createAdminService.execute(adminInput);

        expect(hash).toHaveBeenCalledWith('password123', 10);
        expect(prismaClientMock.admin.findFirst).toHaveBeenCalledWith({
            where: {
                username: 'admin'
            }
        });
        expect(prismaClientMock.admin.create).not.toHaveBeenCalled();
        expect(result).toEqual({ 
            error: true, 
            message: 'Admin already created', 
            code: ErrorCodes.USER_ALREADY_EXISTS 
        });
    });
});
