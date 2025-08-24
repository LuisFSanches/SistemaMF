import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetAddressByStreetAndNumberService } from '../GetAddressByStreetAndNumberService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetAddressByStreetAndNumber', () => {
    let getAddressByStreetAndNumber: GetAddressByStreetAndNumberService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(() => {
        vi.clearAllMocks();
        getAddressByStreetAndNumber = new GetAddressByStreetAndNumberService();
        prisma = prismaClient as DeepMockProxy<PrismaClient>;
    });

    it('should get an address by street and street number', async () => {
        const street = "Rua A";
        const streetNumber = "100";
        const client_id = "123";
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

        const result = await getAddressByStreetAndNumber.execute(client_id, street, streetNumber);

        expect(prisma.address.findFirst).toHaveBeenCalledWith({
            where: {
                street,
                street_number: streetNumber,
                client_id
            }
        });
        expect(result).toEqual(
            mockAddressData
        );
    });

    it('should return null when address is not found', async () => {
        const client_id = "123";
        const street = "Rua Inexistente";
        const streetNumber = "999";

        (prismaClient as DeepMockProxy<PrismaClient>).address.findFirst.mockResolvedValue(null);

        const result = await getAddressByStreetAndNumber.execute(client_id, street, streetNumber);

        expect(prisma.address.findFirst).toHaveBeenCalledWith({
            where: {
                street,
                street_number: streetNumber,
                client_id
            }
        });
        expect(result).toEqual(null);
    });
});
