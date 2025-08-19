import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UpdateAddressService } from '../UpdateAddressService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('UpdateAddressService', () => {
    let updateAddressService: UpdateAddressService;

    beforeEach(() => {
        updateAddressService = new UpdateAddressService();
    });

    it('should update an address', async () => {
        const mockedAddress = {
            id: "abc123",
            client_id: "client123",
            postal_code: '12345678',
            street: 'Rua 1',
            street_number: '123',
            complement: 'Complemento 1',
            reference_point: 'Ponto de Referência 1',
            neighborhood: 'Bairro 1',
            city: 'Cidade 1',
            state: 'Estado 1',
            country: 'País 1',
        };

        const updatedAddress = {
            id: "abc123",
            client_id: "client123",
            postal_code: '12345678',
            street: 'Rua 2',
            street_number: '123',
            complement: 'Complemento 1',
            reference_point: 'Ponto de Referência 1',
            neighborhood: 'Bairro 1',
            city: 'Cidade 1',
            state: 'Estado 1',
            country: 'País 1',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).address.update.mockResolvedValue(updatedAddress);

        const result = await updateAddressService.execute(mockedAddress);

        expect(prismaClient.address.update).toHaveBeenCalledWith({
            where: {
                id: mockedAddress.id
            },
            data: mockedAddress
        });

        expect(result).toEqual({ status: "Address successfully updated", address: updatedAddress });
    });
});