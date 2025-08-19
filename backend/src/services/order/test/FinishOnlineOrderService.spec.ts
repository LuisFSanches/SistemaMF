import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { FinishOnlineOrderService } from '../FinishOnlineOrderService';

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
import moment from 'moment-timezone';

describe('FinishOnlineOrderService', () => {
    let finishOnlineOrderService: FinishOnlineOrderService;

    beforeEach(() => {
        finishOnlineOrderService = new FinishOnlineOrderService();
        vi.clearAllMocks();
    });

    it('should finish an online order', async () => {
        const mockedOrderId = "abc123";
        const mockOnlineOrder = {
            id: mockedOrderId,
            client_id: "123",
            client_address_id: "456",
            type_of_delivery: "delivery",
            pickup_on_store: false,
            receiver_name: "John Doe",
            receiver_phone: "123456789",
            delivery_date: new Date('2023-08-01T15:00:00.000Z'),
            status: "pending",
            has_card: false,
            online_code: '123456789'
        };

        const mockedUpdatedOrder = {
            ...mockOnlineOrder,
            code: 1001,
            description: "Order description",
            additional_information: "Additional information",
            products_value: 100.50,
            delivery_fee: 10.00,
            total: 110.50,
            payment_method: "cash",
            payment_received: false,
            created_by: "123",
            updated_by: "123",
            online_order: false,
            is_delivery: true,
            delivery_date: new Date('2023-08-01T15:00:00.000Z'),
            created_at: new Date('2023-08-01T10:00:00.000Z'),
            updated_at: new Date('2023-08-01T10:00:00.000Z'),
            card_message: null,
            card_from: null,
            card_to: null,
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

        const mockedFormattedDeliveryDate = moment.utc(mockOnlineOrder.delivery_date)
            .tz('America/Sao_Paulo', true)
            .set({ hour: 12, minute: 0, second: 0 })
            .toDate();

        (prismaClient as DeepMockProxy<PrismaClient>).order.update.mockResolvedValue(mockedUpdatedOrder);

        const result = await finishOnlineOrderService.execute(mockOnlineOrder);

        expect(prismaClient.order.update).toHaveBeenCalledWith({
            where: {
                id: mockOnlineOrder.id,
                online_code: mockOnlineOrder.online_code
            },
            data: {
                client_id: mockOnlineOrder.client_id,
                client_address_id: mockOnlineOrder.client_address_id,
                type_of_delivery: mockOnlineOrder.type_of_delivery,
                pickup_on_store: mockOnlineOrder.pickup_on_store,
                receiver_name: mockOnlineOrder.receiver_name,
                receiver_phone: mockOnlineOrder.receiver_phone,
                delivery_date: mockedFormattedDeliveryDate,
                status: mockOnlineOrder.status,
                has_card: mockOnlineOrder.has_card,
                online_code: mockOnlineOrder.online_code,
                id: mockOnlineOrder.id
            },
            include: {
                client: true,
                clientAddress: true
            }
        });

        expect(result).toEqual(mockedUpdatedOrder);
    });
});
