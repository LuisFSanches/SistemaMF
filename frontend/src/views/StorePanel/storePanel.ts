// Tipos e regras de data do painel da loja.
// As datas são chaves 'YYYY-MM-DD' (data de calendário do pedido, sem horário).

export type PanelOrderStatus = 'todo' | 'production' | 'delivery';
export type PanelOrderOrigin = 'STORE_FRONT' | 'LINK' | 'COUNTER';

export interface IPanelOrder {
    code: number;
    date: string;
    status: PanelOrderStatus;
    items: string[];
    fulfillment: 'ENTREGA' | 'RETIRADA';
    neighborhood?: string;
    origin: PanelOrderOrigin;
}

export interface IPanelOrdersResponse {
    today: string;
    orders: IPanelOrder[];
}

export const ORIGIN_LABEL: Record<PanelOrderOrigin, string> = {
    STORE_FRONT: 'Loja online',
    LINK: 'Link',
    COUNTER: 'Balcão'
};

export function dateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function daysLate(date: string, today: string): number {
    return Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${date}T12:00:00Z`)) / 86400000);
}

export function visibleOrders(orders: IPanelOrder[], today: string) {
    return {
        overdue: orders
            .filter(order => order.date < today)
            .sort((a, b) => a.date.localeCompare(b.date) || a.code - b.code),
        // Pedido mais novo no topo de cada coluna
        today: orders
            .filter(order => order.date === today)
            .sort((a, b) => b.code - a.code),
    };
}
