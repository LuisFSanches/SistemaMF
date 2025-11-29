import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { IDeliveryManDetails, IDeliveryItem, IDeliveryHistoryItem } from "../../interfaces/IDeliveryManDetails";

interface GetDeliveryManRequest {
    id: string
}

class GetDeliveryManService {
    async execute({ id }: GetDeliveryManRequest): Promise<IDeliveryManDetails> {
        try {
            // 1. Buscar informações do motoboy
            const deliveryMan = await prismaClient.deliveryMan.findFirst({
                where: { id }
            });

            if (!deliveryMan) {
                throw new BadRequestException(
                    "Delivery man not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 2. Buscar todas as entregas do motoboy com informações do pedido
            const orderDeliveries = await prismaClient.orderDelivery.findMany({
                where: { 
                    delivery_man_id: id,
                },
                include: {
                    order: {
                        select: {
                            code: true,
                            delivery_fee: true
                        }
                    }
                },
                orderBy: {
                    delivery_date: 'desc'
                }
            });

            // 3. Formatar dados das entregas
            const deliveries: IDeliveryItem[] = orderDeliveries.map(delivery => ({
                id: delivery.id,
                order_code: delivery.order.code,
                order_id: delivery.order_id,
                delivery_date: delivery.delivery_date,
                delivery_fee: delivery.order.delivery_fee,
                is_paid: delivery.is_paid
            }));

            // 4. Criar histórico de entregas agrupado por data (para o gráfico)
            const historyMap = new Map<string, { count: number, total: number }>();
            
            orderDeliveries.forEach(delivery => {
                const dateKey = delivery.delivery_date.toISOString().split('T')[0];
                const existing = historyMap.get(dateKey) || { count: 0, total: 0 };
                
                historyMap.set(dateKey, {
                    count: existing.count + 1,
                    total: existing.total + delivery.order.delivery_fee
                });
            });

            const deliveryHistory: IDeliveryHistoryItem[] = Array.from(historyMap.entries())
                .map(([date, data]) => ({
                    date,
                    count: data.count,
                    total: data.total
                }))
                .sort((a, b) => a.date.localeCompare(b.date));

            // 5. Calcular dados do resumo (cards do topo)
            const totalDeliveries = orderDeliveries.length;
            const totalPaid = orderDeliveries
                .filter(d => d.is_paid)
                .reduce((sum, d) => sum + d.order.delivery_fee, 0);
            const pendingPayment = orderDeliveries
                .filter(d => !d.is_paid)
                .reduce((sum, d) => sum + d.order.delivery_fee, 0);

            // 6. Retornar objeto completo
            return {
                deliveryMan: {
                    name: deliveryMan.name,
                    phone_number: deliveryMan.phone_number
                },
                deliveries,
                deliveryHistory,
                summary: {
                    total_deliveries: totalDeliveries,
                    total_paid: totalPaid,
                    pending_payment: pendingPayment
                }
            };
        } catch (error: any) {
            console.error("[GetDeliveryManService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetDeliveryManService };
