import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CreateOrderService } from '../CreateOrderService';
import { ErrorCodes } from '../../../exceptions/root';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

vi.mock('moment-timezone', () => ({
    default: {
        utc: vi.fn().mockReturnThis(),
        tz: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        toDate: vi.fn(() => new Date('2023-08-01T15:00:00.000Z'))
    }
}));

import prismaClient from '../../../prisma';

describe('CreateOrderService', () => {
    let createOrderService: CreateOrderService;

    beforeEach(() => {
        createOrderService = new CreateOrderService();
        vi.clearAllMocks();
    });

    it('should create an order successfully', async () => {
        const mockOrderData = {
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
            status: "pending",
            has_card: false,
            online_order: false,
            online_code: "123",
            is_delivery: true,
            delivery_date: "2023-08-01T12:00:00.000Z",
        };

        const mockProducts = [
            {
                id: '456',
                quantity: 2,
                price: 10.99
            },
            {
                id: '789',
                quantity: 1,
                price: 25.50
            }
        ];

        const mockCreatedOrder = {
            id: "abc123",
            code: 1001,
            ...mockOrderData,
            delivery_date: new Date('2023-08-01T15:00:00.000Z'),
            created_at: new Date('2023-08-01T10:00:00.000Z'),
            updated_at: new Date('2023-08-01T10:00:00.000Z'),
            card_message: null,
            card_from: null,
            card_to: null,
            type_of_delivery: null,
            client: {
                id: '123',
                first_name: 'John',
                last_name: 'Doe',
                phone_number: '123456789',
                created_at: new Date('2023-07-01T10:00:00.000Z'),
                updated_at: new Date('2023-07-01T10:00:00.000Z')
            },
            clientAddress: {
                id: '456',
                client_id: '123',
                street: 'Test Street',
                street_number: '123',
                complement: null,
                neighborhood: 'Test Neighborhood',
                reference_point: null,
                city: 'Test City',
                state: 'Test State',
                postal_code: '12345-678',
                country: 'Brazil',
                created_at: new Date('2023-07-01T10:00:00.000Z'),
                updated_at: new Date('2023-07-01T10:00:00.000Z')
            }
        };

        (prismaClient as DeepMockProxy<PrismaClient>).order.create.mockResolvedValue(mockCreatedOrder);

        const result = await createOrderService.execute(mockOrderData, mockProducts);

        expect(prismaClient.order.create).toHaveBeenCalledWith({
            data: {
                ...mockOrderData,
                delivery_date: new Date('2023-08-01T15:00:00.000Z'),
                orderItems: {
                    create: [
                        {
                            product_id: '456',
                            quantity: 2,
                            price: 10.99
                        },
                        {
                            product_id: '789',
                            quantity: 1,
                            price: 25.50
                        }
                    ]
                }
            },
            include: {
                client: true,
                clientAddress: true
            }
        });
        expect(result).toEqual(mockCreatedOrder);
    });
});
