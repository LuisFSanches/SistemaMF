import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAddressService } from '../GetAddressService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAddressService', () => {
    let getAddressService: GetAddressService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(() => {
        vi.clearAllMocks();
        getAddressService = new GetAddressService();
        prisma = prismaClient as DeepMockProxy<PrismaClient>;
    });

    it('should get an address', async () => {
        const addressId = "abc123";
        const mockAddressData = {
            id: 'abc123',
            client_id: '123',
            street: 'Rua A',
            street_number: '100',
            complement: 'Apto 202',
            reference_point: 'Próximo à padaria',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            postal_code: '01000-000',
            country: 'Brasil',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).address.findFirst.mockResolvedValue(mockAddressData);

        const result = await getAddressService.execute(String(addressId));

        expect(prisma.address.findFirst).toHaveBeenCalledWith({
            where: {
                id: String(addressId)
            }
        });
        expect(result).toEqual({
            address: mockAddressData
        });
    });
});