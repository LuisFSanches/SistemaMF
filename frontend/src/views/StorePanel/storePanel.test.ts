import { dateKey, daysLate, visibleOrders, IPanelOrder } from './storePanel';

const order = (code: number, date: string, overrides: Partial<IPanelOrder> = {}): IPanelOrder => ({
    code,
    date,
    status: 'todo',
    items: ['1x Buquê de rosas'],
    fulfillment: 'RETIRADA',
    origin: 'COUNTER',
    ...overrides
});

describe('painel da loja: datas', () => {
    it('separa atrasados (mais antigo primeiro) e pedidos de hoje (mais novo primeiro)', () => {
        const orders = [
            order(1040, '2026-10-15'),
            order(1031, '2026-10-12'),
            order(1028, '2026-10-10'),
            order(1045, '2026-10-15'),
        ];

        const visible = visibleOrders(orders, '2026-10-15');

        expect(visible.overdue.map(o => o.code)).toEqual([1028, 1031]);
        expect(visible.today.map(o => o.code)).toEqual([1045, 1040]);
        expect(visible.overdue.map(o => daysLate(o.date, '2026-10-15'))).toEqual([5, 3]);
    });

    it('não mostra pedidos de dias futuros e calcula atraso na virada do mês', () => {
        const visible = visibleOrders([order(9999, '2026-11-02'), order(1, '2026-10-31')], '2026-11-01');

        expect([...visible.today, ...visible.overdue].some(o => o.code === 9999)).toBe(false);
        expect(daysLate('2026-10-31', '2026-11-01')).toBe(1);
    });

    it('formata a data local como chave YYYY-MM-DD', () => {
        expect(dateKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    });
});
