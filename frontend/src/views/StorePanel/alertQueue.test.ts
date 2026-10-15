import {
    alertQueueReducer,
    initialAlertQueueState,
    displayDuration,
    findMissedOrders,
    parseOrderCode,
    IAlertQueueState,
    IPanelAlert,
    DEDUPE_WINDOW_MS,
    NORMAL_DURATION_MS,
    FAST_DURATION_MS
} from './alertQueue';
import { IPanelOrder } from './storePanel';

const alert = (code: number | null, kind: IPanelAlert['kind'] = 'new', at = 1000): IPanelAlert => ({
    id: `${kind}-${code}-${at}`,
    kind,
    code,
    title: 'NOVO PEDIDO',
    at
});

const enqueueAll = (alerts: IPanelAlert[], state: IAlertQueueState = initialAlertQueueState) =>
    alerts.reduce((current, item) => alertQueueReducer(current, { type: 'enqueue', alert: item }), state);

describe('fila de alertas do painel', () => {
    it('exibe o primeiro alerta e enfileira os demais na ordem de chegada', () => {
        const state = enqueueAll([alert(1), alert(2), alert(3)]);

        expect(state.current?.code).toBe(1);
        expect(state.queue.map(a => a.code)).toEqual([2, 3]);
    });

    it('não perde nenhum alerta numa rajada de 10', () => {
        let state = enqueueAll(Array.from({ length: 10 }, (_, i) => alert(100 + i, 'new', 1000 + i)));
        const shown: number[] = [];

        while (state.current) {
            shown.push(state.current.code as number);
            state = alertQueueReducer(state, { type: 'next' });
        }

        expect(shown).toEqual(Array.from({ length: 10 }, (_, i) => 100 + i));
        expect(state.queue).toHaveLength(0);
    });

    it('ignora o mesmo aviso repetido dentro de 60 s', () => {
        const state = enqueueAll([alert(1, 'new', 1000), alert(1, 'new', 5000), alert(1, 'payment', 9000)]);

        expect(state.current?.code).toBe(1);
        expect(state.queue).toHaveLength(0);
        expect(state.history).toHaveLength(1);
    });

    it('aceita de novo depois da janela de 60 s e trata entrega como aviso separado', () => {
        const state = enqueueAll([
            alert(1, 'new', 1000),
            alert(1, 'done', 2000),
            alert(1, 'new', 1000 + DEDUPE_WINDOW_MS + 1)
        ]);

        expect([state.current, ...state.queue].map(a => a?.kind)).toEqual(['new', 'done', 'new']);
    });

    it('guarda só os 5 últimos no histórico', () => {
        const state = enqueueAll(Array.from({ length: 7 }, (_, i) => alert(i, 'new', 1000 + i)));

        expect(state.history.map(a => a.code)).toEqual([6, 5, 4, 3, 2]);
    });

    it('encurta o tempo de exibição quando a fila cresce', () => {
        expect(displayDuration(0)).toBe(NORMAL_DURATION_MS);
        expect(displayDuration(2)).toBe(NORMAL_DURATION_MS);
        expect(displayDuration(3)).toBe(FAST_DURATION_MS);
    });

    it('extrai o número do pedido', () => {
        expect(parseOrderCode('#1045')).toBe(1045);
        expect(parseOrderCode(undefined)).toBeNull();
    });
});

describe('rede de segurança contra aviso perdido', () => {
    const order = (code: number, origin: IPanelOrder['origin']): IPanelOrder => ({
        code,
        date: '2026-10-15',
        status: 'todo',
        items: [],
        fulfillment: 'RETIRADA',
        origin
    });

    it('acha pedidos online/link novos que ainda não geraram aviso', () => {
        const orders = [order(1046, 'LINK'), order(1040, 'LINK'), order(1047, 'COUNTER'), order(1048, 'STORE_FRONT'), order(1049, 'LINK')];

        const missed = findMissedOrders(orders, 1045, new Set([1049]));

        expect(missed.map(o => o.code)).toEqual([1046, 1048]);
    });
});
