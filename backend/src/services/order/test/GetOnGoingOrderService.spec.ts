import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetOnGoingOrderService } from '../GetOnGoingOrderService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

describe('GetOnGoingOrderService', () => {
    let getOnGoingOrderService: GetOnGoingOrderService;

    beforeEach(() => {
        getOnGoingOrderService = new GetOnGoingOrderService();
        vi.clearAllMocks();
    });

    it('should return orders', async () => {
        const mockedOrders = [
            {
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
            }
        ];

        (prismaClient as DeepMockProxy<PrismaClient>).order.findMany.mockResolvedValue(mockedOrders);

        const result = await getOnGoingOrderService.execute();

        expect(prismaClient.order.findMany).toHaveBeenCalledWith({
            where: {
                status: {
                    notIn: ['FINISHED', 'CANCELED', 'DONE']
                }
            },
            orderBy: {
                code: "desc"
            },
            include: {
                client: true,
                clientAddress: true,
                createdBy: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        expect(result).toEqual(mockedOrders);
    });
});