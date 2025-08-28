// Use mock do prisma client
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { DeleteClientService } from '../DeleteClientService';

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
});
