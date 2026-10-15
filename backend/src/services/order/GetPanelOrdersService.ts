import moment from 'moment-timezone';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

const STORE_TIMEZONE = 'America/Sao_Paulo';

// Pedidos que não aparecem no painel da loja
const HIDDEN_STATUSES = ['FINISHED', 'CANCELED', 'DONE', 'PENDING_PAYMENT', 'WAITING_FOR_CLIENT'];

const PANEL_STATUS: Record<string, PanelOrderStatus> = {
    OPENED: 'todo',
    IN_PROGRESS: 'production',
    IN_DELIVERY: 'delivery'
};

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

class GetPanelOrdersService {
    /**
     * Pedidos de hoje e atrasados para o painel da loja.
     * Retorna apenas o necessário para a produção: nenhum dado do cliente.
     */
    async execute(store_id?: string, now: Date = new Date()) {
        // delivery_date é uma data de calendário (exibida em UTC no sistema),
        // então "hoje" é a data em São Paulo comparada com a data UTC do pedido.
        const today = moment.tz(now, STORE_TIMEZONE).format('YYYY-MM-DD');
        const tomorrow = moment.tz(now, STORE_TIMEZONE).add(1, 'day').format('YYYY-MM-DD');

        try {
            const whereClause: any = {
                status: {
                    notIn: HIDDEN_STATUSES
                },
                delivery_date: {
                    lt: new Date(`${tomorrow}T00:00:00.000Z`)
                }
            };

            if (store_id) {
                whereClause.store_id = store_id;
            }

            const orders = await prismaClient.order.findMany({
                where: whereClause,
                orderBy: {
                    code: 'asc'
                },
                select: {
                    code: true,
                    status: true,
                    delivery_date: true,
                    is_delivery: true,
                    pickup_on_store: true,
                    store_front_order: true,
                    online_order: true,
                    clientAddress: {
                        select: {
                            neighborhood: true
                        }
                    },
                    orderItems: {
                        select: {
                            quantity: true,
                            product: {
                                select: { name: true }
                            },
                            storeProduct: {
                                select: {
                                    product: {
                                        select: { name: true }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return {
                today,
                orders: orders.map((order): IPanelOrder => {
                    const isDelivery = order.is_delivery && !order.pickup_on_store;
                    const neighborhood = order.clientAddress?.neighborhood?.trim();

                    return {
                        code: order.code,
                        date: moment.utc(order.delivery_date).format('YYYY-MM-DD'),
                        status: PANEL_STATUS[order.status] || 'todo',
                        items: order.orderItems.map(item => {
                            const name = item.storeProduct?.product?.name || item.product?.name || 'Item';
                            return `${item.quantity}x ${name}`;
                        }),
                        fulfillment: isDelivery ? 'ENTREGA' : 'RETIRADA',
                        ...(isDelivery && neighborhood ? { neighborhood } : {}),
                        origin: order.store_front_order ? 'STORE_FRONT' : order.online_order ? 'LINK' : 'COUNTER'
                    };
                })
            };
        } catch (error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetPanelOrdersService };
