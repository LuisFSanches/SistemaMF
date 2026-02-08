import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateAdminPasswordService } from '../UpdateAdminPasswordService';
import { BadRequestException } from '../../../exceptions/bad-request';
import { ErrorCodes } from '../../../exceptions/root';

// Mock do Prisma Client
vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('UpdateAdminPasswordService', () => {
    let service: UpdateAdminPasswordService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new UpdateAdminPasswordService();
    });

    it('should update admin password successfully', async () => {
        // Arrange
        const mockAdmin = {
            id: 'admin-123',
            name: 'Test Admin',
            username: 'test.admin',
            password: 'hashed_password',
            role: 'ADMIN',
            email: 'test@example.com',
            store_id: 'store-123',
            created_at: new Date(),
            updated_at: new Date()
        };

        const mockUpdatedAdmin = {
            id: 'admin-123',
            name: 'Test Admin',
            username: 'test.admin',
            role: 'ADMIN',
            email: 'test@example.com',
            store_id: 'store-123',
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>)
            .admin
            .findFirst
            .mockResolvedValue(mockAdmin);

        (prismaClient as DeepMockProxy<PrismaClient>)
            .admin
            .update
            .mockResolvedValue(mockUpdatedAdmin as any);

        // Act
        const result = await service.execute({
            admin_id: 'admin-123',
            new_password: 'new_password_123'
        });

        // Assert
        expect(prismaClient.admin.findFirst).toHaveBeenCalledWith({
            where: { id: 'admin-123' }
        });
        expect(prismaClient.admin.update).toHaveBeenCalled();
        expect(result).toEqual(mockUpdatedAdmin);
    });

    it('should throw error when validation fails - missing admin_id', async () => {
        // Arrange
        const invalidData = {
            admin_id: '',
            new_password: 'new_password_123'
        };

        // Act & Assert
        await expect(service.execute(invalidData))
            .rejects
            .toThrow(BadRequestException);
    });

    it('should throw error when validation fails - password too short', async () => {
        // Arrange
        const invalidData = {
            admin_id: 'admin-123',
            new_password: '123' // Menos de 6 caracteres
        };

        // Act & Assert
        await expect(service.execute(invalidData))
            .rejects
            .toThrow('Password must be at least 6 characters');
    });

    it('should throw error when admin not found', async () => {
        // Arrange
        (prismaClient as DeepMockProxy<PrismaClient>)
            .admin
            .findFirst
            .mockResolvedValue(null);

        // Act & Assert
        await expect(service.execute({
            admin_id: 'non-existent-id',
            new_password: 'new_password_123'
        }))
            .rejects
            .toThrow('Admin not found');
    });

    it('should throw error when database update fails', async () => {
        // Arrange
        const mockAdmin = {
            id: 'admin-123',
            name: 'Test Admin',
            username: 'test.admin',
            password: 'hashed_password',
            role: 'ADMIN',
            email: 'test@example.com',
            store_id: 'store-123',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>)
            .admin
            .findFirst
            .mockResolvedValue(mockAdmin);

        (prismaClient as DeepMockProxy<PrismaClient>)
            .admin
            .update
            .mockRejectedValue(new Error('Database error'));

        // Act & Assert
        await expect(service.execute({
            admin_id: 'admin-123',
            new_password: 'new_password_123'
        }))
            .rejects
            .toThrow();
    });
});
