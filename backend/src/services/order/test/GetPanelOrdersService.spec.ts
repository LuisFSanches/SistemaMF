import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { GetPanelOrdersService } from '../GetPanelOrdersService';

vi.mock('../../../prisma', () => ({
    default: mockDeep<PrismaClient>()
}));

import prismaClient from '../../../prisma';

const prismaMock = prismaClient as unknown as DeepMockProxy<PrismaClient>;

const buildOrder = (overrides: any = {}) => ({
    code: 1045,
    status: 'OPENED',
    delivery_date: new Date('2026-10-15T15:00:00.000Z'),
    is_delivery: true,
    pickup_on_store: false,
    store_front_order: false,
    online_order: false,
    clientAddress: { neighborhood: 'Moema' },
    orderItems: [
        { quantity: 2, product: null, storeProduct: { product: { name: 'Buquê de rosas' } } },
        { quantity: 1, product: { name: 'Caixa de chocolates' }, storeProduct: null }
    ],
    ...overrides
});

describe('GetPanelOrdersService', () => {
    let service: GetPanelOrdersService;

    beforeEach(() => {
        service = new GetPanelOrdersService();
        vi.clearAllMocks();
    });

    it('should query only visible statuses up to the end of today in Sao Paulo', async () => {
        prismaMock.order.findMany.mockResolvedValue([] as any);

        // 23:30 em São Paulo de 15/10 = 02:30 UTC de 16/10
        const result = await service.execute('store-1', new Date('2026-10-16T02:30:00.000Z'));

        expect(result.today).toBe('2026-10-15');

        const args: any = prismaMock.order.findMany.mock.calls[0][0];
        expect(args.where.store_id).toBe('store-1');
        expect(args.where.status.notIn).toEqual(
            expect.arrayContaining(['DONE', 'CANCELED', 'PENDING_PAYMENT', 'WAITING_FOR_CLIENT'])
        );
        expect(args.where.delivery_date.lt).toEqual(new Date('2026-10-16T00:00:00.000Z'));
    });

    it('should never select client data', async () => {
        prismaMock.order.findMany.mockResolvedValue([] as any);

        await service.execute('store-1', new Date('2026-10-15T12:00:00.000Z'));

        const args: any = prismaMock.order.findMany.mock.calls[0][0];
        expect(args.include).toBeUndefined();
        expect(args.select.client).toBeUndefined();
        expect(args.select.store).toBeUndefined();
        expect(Object.keys(args.select.clientAddress.select)).toEqual(['neighborhood']);
    });

    it('should map orders to the panel format', async () => {
        prismaMock.order.findMany.mockResolvedValue([
            buildOrder(),
            buildOrder({
                code: 1031,
                status: 'IN_PROGRESS',
                delivery_date: new Date('2026-10-12T00:00:00.000Z'),
                is_delivery: false,
                store_front_order: true
            }),
            buildOrder({ code: 1039, status: 'IN_DELIVERY', online_order: true, pickup_on_store: true })
        ] as any);

        const { orders } = await service.execute('store-1', new Date('2026-10-15T12:00:00.000Z'));

        expect(orders[0]).toEqual({
            code: 1045,
            date: '2026-10-15',
            status: 'todo',
            items: ['2x Buquê de rosas', '1x Caixa de chocolates'],
            fulfillment: 'ENTREGA',
            neighborhood: 'Moema',
            origin: 'COUNTER'
        });

        expect(orders[1]).toMatchObject({ date: '2026-10-12', status: 'production', fulfillment: 'RETIRADA', origin: 'STORE_FRONT' });
        expect(orders[1].neighborhood).toBeUndefined();

        expect(orders[2]).toMatchObject({ status: 'delivery', fulfillment: 'RETIRADA', origin: 'LINK' });
    });

    it('should keep a date-only delivery date on its own calendar day', async () => {
        prismaMock.order.findMany.mockResolvedValue([
            buildOrder({ delivery_date: new Date('2026-10-15T00:00:00.000Z') })
        ] as any);

        // 21:00 em São Paulo ainda é dia 15
        const { today, orders } = await service.execute('store-1', new Date('2026-10-16T00:00:00.000Z'));

        expect(today).toBe('2026-10-15');
        expect(orders[0].date).toBe('2026-10-15');
    });

    it('should throw a BadRequestException when the query fails', async () => {
        prismaMock.order.findMany.mockRejectedValue(new Error('Database error'));

        await expect(service.execute('store-1')).rejects.toThrow('Database error');
    });
});
