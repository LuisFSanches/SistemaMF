import { IPanelOrder } from './storePanel';

// Fila de alertas do painel da loja.
// Regra central: nenhum alerta se perde. Os alertas aparecem um por vez,
// na ordem de chegada, e só saem da fila depois de exibidos.

export type AlertKind = 'new' | 'payment' | 'done';

export interface IPanelAlert {
    id: string;
    kind: AlertKind;
    code: number | null;
    title: string;
    detail?: string;
    at: number;
}

export interface IAlertQueueState {
    current: IPanelAlert | null;
    queue: IPanelAlert[];
    history: IPanelAlert[];
    recent: Record<string, number>;
}

export type AlertQueueAction =
    | { type: 'enqueue'; alert: IPanelAlert }
    | { type: 'next' };

export const DEDUPE_WINDOW_MS = 60000;
export const HISTORY_SIZE = 5;
export const NORMAL_DURATION_MS = 6000;
export const FAST_DURATION_MS = 3500;
export const FAST_QUEUE_THRESHOLD = 3;

export const initialAlertQueueState: IAlertQueueState = {
    current: null,
    queue: [],
    history: [],
    recent: {}
};

// "Novo pedido" e "pagamento confirmado" do mesmo pedido contam como um só aviso
export function alertKey(alert: Pick<IPanelAlert, 'kind' | 'code' | 'id'>): string {
    if (alert.code === null) {
        return `id:${alert.id}`;
    }
    return alert.kind === 'done' ? `done:${alert.code}` : `order:${alert.code}`;
}

export function alertQueueReducer(state: IAlertQueueState, action: AlertQueueAction): IAlertQueueState {
    switch (action.type) {
        case 'enqueue': {
            const { alert } = action;
            const key = alertKey(alert);

            const recent: Record<string, number> = {};
            Object.entries(state.recent).forEach(([recentKey, at]) => {
                if (alert.at - at < DEDUPE_WINDOW_MS) {
                    recent[recentKey] = at;
                }
            });

            if (recent[key] !== undefined) {
                return { ...state, recent };
            }

            recent[key] = alert.at;
            const history = [alert, ...state.history].slice(0, HISTORY_SIZE);

            if (!state.current) {
                return { ...state, current: alert, history, recent };
            }

            return { ...state, queue: [...state.queue, alert], history, recent };
        }
        case 'next': {
            const [next = null, ...queue] = state.queue;
            return { ...state, current: next, queue };
        }
        default:
            return state;
    }
}

// Com fila grande, cada aviso fica menos tempo para a fila andar
export function displayDuration(pending: number): number {
    return pending >= FAST_QUEUE_THRESHOLD ? FAST_DURATION_MS : NORMAL_DURATION_MS;
}

// Extrai o número do pedido de textos como "#1045"
export function parseOrderCode(value: unknown): number | null {
    const digits = String(value ?? '').replace(/\D/g, '');
    return digits ? Number(digits) : null;
}

// Rede de segurança: pedidos online/link criados depois que o painel abriu
// e que não geraram aviso pelo socket (ex.: conexão caiu).
export function findMissedOrders(
    orders: IPanelOrder[],
    baselineCode: number,
    alertedCodes: Set<number>
): IPanelOrder[] {
    return orders
        .filter(order => order.code > baselineCode
            && order.origin !== 'COUNTER'
            && !alertedCodes.has(order.code))
        .sort((a, b) => a.code - b.code);
}
