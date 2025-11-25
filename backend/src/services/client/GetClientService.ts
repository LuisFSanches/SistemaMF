import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetClientService{
    async execute(id: string) {
        try {
            // 1. Buscar informações básicas do cliente
            const client = await prismaClient.client.findFirst({
                where: { id }
            });

            if (!client) {
                throw new BadRequestException(
                    "Client not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 2. Buscar todas as ordens do cliente
            const orders = await prismaClient.order.findMany({
                where: { client_id: id },
                select: {
                    id: true,
                    code: true,
                    description: true,
                    total: true,
                    status: true,
                    delivery_date: true,
                    created_at: true,
                    payment_method: true,
                    payment_received: true,
                    pickup_on_store: true,
                    online_order: true,
                    store_front_order: true,
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            // 3. Buscar todos os endereços do cliente
            const addresses = await prismaClient.address.findMany({
                where: { client_id: id },
                orderBy: {
                    created_at: 'desc'
                }
            });

            // 4. Calcular estatísticas e histórico de gastos
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
            const averageTicket = totalOrders > 0 ? totalSpent / totalOrders : 0;
            const lastOrder = orders.length > 0 ? orders[0] : null;
            const lastOrderValue = lastOrder ? lastOrder.total : 0;

            // 5. Gerar histórico de gastos agrupado por mês (últimos 12 meses)
            const spendingHistory = this.generateSpendingHistory(orders);

            return {
                clientInfo: {
                    id: client.id,
                    name: `${client.first_name} ${client.last_name}`,
                    first_name: client.first_name,
                    last_name: client.last_name,
                    phone_number: client.phone_number,
                    created_at: client.created_at,
                },
                orders: orders.map(order => ({
                    id: order.id,
                    code: order.code,
                    date: order.delivery_date,
                    created_at: order.created_at,
                    description: order.description,
                    total: order.total,
                    status: order.status,
                    payment_method: order.payment_method,
                    payment_received: order.payment_received,
                    pickup_on_store: order.pickup_on_store,
                    online_order: order.online_order,
                    store_front_order: order.store_front_order,
                })),
                spendingHistory,
                addresses: addresses.map(address => ({
                    id: address.id,
                    street: address.street,
                    street_number: address.street_number,
                    complement: address.complement,
                    neighborhood: address.neighborhood,
                    reference_point: address.reference_point,
                    city: address.city,
                    state: address.state,
                    postal_code: address.postal_code,
                    country: address.country,
                    created_at: address.created_at,
                })),
                statistics: {
                    totalOrders,
                    totalSpent,
                    averageTicket,
                    lastOrderValue,
                    lastOrderDate: lastOrder ? lastOrder.created_at : null,
                }
            };

        } catch(error: any) {
            console.error("[GetClientService] Failed:", error);
            
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }

    private generateSpendingHistory(orders: any[]) {
        const history: { [key: string]: number } = {};
        const now = new Date();
        
        // Inicializar últimos 12 meses com zero
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            history[key] = 0;
        }

        // Agregar gastos por mês
        orders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
            
            if (history[key] !== undefined) {
                history[key] += order.total;
            }
        });

        // Converter para array de objetos
        return Object.entries(history).map(([month, amount]) => ({
            month,
            amount
        }));
    }
}

export { GetClientService }