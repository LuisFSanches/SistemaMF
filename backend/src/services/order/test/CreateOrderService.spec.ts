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
        const store_id = 'store-123';
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
            discount: 5.00,
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
            store_id,
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

        // Mock da busca pelo último código
        (prismaClient as DeepMockProxy<PrismaClient>).order.findFirst.mockResolvedValue({
            code: 1000
        } as any);

        (prismaClient as DeepMockProxy<PrismaClient>).order.create.mockResolvedValue(mockCreatedOrder);

        const result = await createOrderService.execute(mockOrderData, mockProducts, store_id);

        // Verifica se buscou o último código para o store correto
        expect(prismaClient.order.findFirst).toHaveBeenCalledWith({
            where: { store_id },
            orderBy: { code: 'desc' },
            select: { code: true }
        });

        expect(prismaClient.order.create).toHaveBeenCalledWith({
            data: {
                ...mockOrderData,
                code: 1001,
                store_id,
                delivery_date: new Date('2023-08-01T15:00:00.000Z'),
                orderItems: {
                    create: [
                        {
                            product_id: '456',
                            quantity: 2,
                            price: 10.99,
                            store_id
                        },
                        {
                            product_id: '789',
                            quantity: 1,
                            price: 25.50,
                            store_id
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

    it('should start code at 1 for a new store with no previous orders', async () => {
        const store_id = 'new-store-123';
        const mockOrderData = {
            description: "First order",
            client_id: '123',
            client_address_id: '456',
            products_value: 50.00,
            delivery_fee: 10.00,
            discount: 0,
            total: 60.00,
            delivery_date: "2023-08-01T12:00:00.000Z",
        };

        const mockProducts = [
            {
                id: '456',
                quantity: 1,
                price: 50.00
            }
        ];

        const mockCreatedOrder = {
            id: "new-order-123",
            code: 1,
            store_id,
            ...mockOrderData,
            delivery_date: new Date('2023-08-01T15:00:00.000Z'),
            created_at: new Date('2023-08-01T10:00:00.000Z'),
            updated_at: new Date('2023-08-01T10:00:00.000Z'),
            client: {} as any,
            clientAddress: {} as any
        };

        // Mock retornando null (nenhum pedido anterior)
        (prismaClient as DeepMockProxy<PrismaClient>).order.findFirst.mockResolvedValue(null);
        (prismaClient as DeepMockProxy<PrismaClient>).order.create.mockResolvedValue(mockCreatedOrder);

        const result = await createOrderService.execute(mockOrderData, mockProducts, store_id);

        // Verifica se o código foi definido como 1
        expect(prismaClient.order.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    code: 1,
                    store_id
                })
            })
        );
        expect(result.code).toBe(1);
    });
});
