import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateAddressService } from '../CreateAddressService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('CreateAddressService', () => {
    const mockAddressData = {
        client_id: '123',
        street: 'Rua A',
        street_number: '100',
        complement: 'Apto 202',
        reference_point: 'Próximo à padaria',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postal_code: '01000-000',
        country: 'Brasil'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should create an address successfully', async () => {
        const mockCreatedAddress = {
            id: 'abc123',
            ...mockAddressData,
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).address.create.mockResolvedValue(mockCreatedAddress);

        const service = new CreateAddressService();
        const result = await service.execute(mockAddressData);

        expect(prismaClient.address.create).toHaveBeenCalledWith({ data: mockAddressData });
        expect(result).toEqual(mockCreatedAddress);
    });

    it('should return error object if Prisma throws an exception', async () => {
        (prismaClient as DeepMockProxy<PrismaClient>).address.create.mockRejectedValue(new Error('Database error'));

        const service = new CreateAddressService();
        const result = await service.execute(mockAddressData);

        expect(result).toEqual({
            error: true,
            message: 'Database error',
            code: ErrorCodes.SYSTEM_ERROR
        });
    });
});
