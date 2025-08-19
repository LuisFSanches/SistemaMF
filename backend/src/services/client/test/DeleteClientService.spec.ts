// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteClientService } from '../DeleteClientService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('DeleteClientService', () => {
    let service: DeleteClientService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new DeleteClientService();
    });

    it('should delete a client successfully', async () => {
        const clientId = 'abc123';

        (prismaClient as DeepMockProxy<PrismaClient>).client.delete.mockResolvedValue({
            id: clientId,
            first_name: 'John',
            last_name: 'Doe',
            phone_number: '123456789',
            created_at: new Date(),
            updated_at: new Date()
        });

        const result = await service.execute(clientId);

        expect(prismaClient.client.delete).toHaveBeenCalledWith({
            where: {
                id: clientId
            }
        });
        expect(result).toEqual({ Status: "Client successfully deleted" });
    });

    it('should return error object if Prisma throws an exception', async () => {
        const clientId = 'abc123';
        
        (prismaClient as DeepMockProxy<PrismaClient>).client.delete.mockRejectedValue(new Error('Database error'));

        const result = await service.execute(clientId);

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });

    it('should handle client not found error', async () => {
        const clientId = 'nonexistent';
        
        (prismaClient as DeepMockProxy<PrismaClient>).client.delete.mockRejectedValue(new Error('Record to delete does not exist'));

        const result = await service.execute(clientId);

        expect(result).toEqual({
            error: true,
            message: 'Record to delete does not exist',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
