import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetWaitingOnlineOrderService } from '../GetWaitingOnlineOrderService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetWaitingOnlineOrderService', () => {
    let service: GetWaitingOnlineOrderService;
    let prisma: DeepMockProxy<PrismaClient>;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new GetWaitingOnlineOrderService();
        prisma = prismaClient as DeepMockProxy<PrismaClient>;
    });

    it('should get an waiting online order', async () => {
        const mockedOrder = {
            id: "abc123",
            code: 1001,
            description: "Order description",
            additional_information: "Additional information",
            client_id: '123',
            client_address_id: '456',
            pickup_on_store: false,
            receiver_name: "John Doe",
            receiver_phone: "123456789",
            products_value: 100.50,
            delivery_fee: 10.00,
            total: 110.50,
            payment_method: "cash",
            payment_received: false,
            created_by: "123",
            updated_by: "123",
            has_card: false,
            online_order: false,
            online_code: "123",
            is_delivery: true,
            delivery_date: new Date('2023-08-01T15:00:00.000Z'),
            status: "PENDING",
            createdAt: new Date('2023-08-01T15:00:00.000Z'),
            updatedAt: new Date('2023-08-01T15:00:00.000Z'),
            card_message: null,
            card_from: null,
            card_to: null,
            type_of_delivery: null,
            client: {
                id: "abc123",
                name: "John Doe",
                email: "5m6bM@example.com",
                phone_number: "123456789",
                createdAt: new Date('2023-08-01T15:00:00.000Z'),
                updatedAt: new Date('2023-08-01T15:00:00.000Z')
            },
            clientAddress: {
                id: "abc123",
                street: "123 Main St",
                street_number: "123",
                neighborhood: "Downtown",
                city: "New York",
                state: "NY",
                postal_code: "10001",
                country: "United States",
                createdAt: new Date('2023-08-01T15:00:00.000Z'),
                updatedAt: new Date('2023-08-01T15:00:00.000Z')
            },
            created_at: new Date('2023-08-01T15:00:00.000Z'),
            updated_at: new Date('2023-08-01T15:00:00.000Z')
        };

        prisma.order.findMany.mockResolvedValue([mockedOrder]);

        const result = await service.execute();

        expect(prisma.order.findMany).toHaveBeenCalledWith({
            where: {
                status: 'WAITING_FOR_CLIENT',
            },
            include: {
                client: true,
                clientAddress: true,
                createdBy: true
            },
            orderBy: {
                code: 'desc'
            }
        });
        expect(result).toEqual({ orders: [mockedOrder] });
    });
});