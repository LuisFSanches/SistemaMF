import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteAddressService } from '../DeleteAddressService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe("DeleteAddressService", () => {
    const mockId = "1222e73d-668e-4f9b-b526-625068f93e48";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should delete address successfully", async () => {
        const mockDeletedAddress = {
            id: mockId,
            client_id: '123',
            street: 'Rua X',
            street_number: '100',
            complement: null,
            reference_point: null,
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            postal_code: null,
            country: 'Brasil',
            created_at: new Date(),
            updated_at: new Date()
        };

        (prismaClient as DeepMockProxy<PrismaClient>).address.delete.mockResolvedValue(mockDeletedAddress);

        const service = new DeleteAddressService();
        const result = await service.execute(mockId);

        expect(prismaClient.address.delete).toHaveBeenCalledWith({ where: { id: mockId } });
        expect(result).toEqual({ Status: "Address successfully deleted" });
    });
});
