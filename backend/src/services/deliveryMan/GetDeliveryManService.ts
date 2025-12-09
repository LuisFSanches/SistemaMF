import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { IDeliveryManDetails, IDeliveryItem, IDeliveryHistoryItem } from "../../interfaces/IDeliveryManDetails";

interface GetDeliveryManRequest {
    id: string
    page?: number
    pageSize?: number
    startDate?: string
    endDate?: string
}

class GetDeliveryManService {
    async execute({ id, page = 1, pageSize = 10, startDate, endDate }: GetDeliveryManRequest): Promise<IDeliveryManDetails> {
        try {
            const skip = (page - 1) * pageSize;

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

            // 2. Criar whereClause para filtros
            let whereClause: any = { 
                delivery_man_id: id
            };

            if (startDate && endDate) {
                whereClause.delivery_date = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            } else if (startDate) {
                whereClause.delivery_date = {
                    gte: new Date(startDate)
                };
            } else if (endDate) {
                whereClause.delivery_date = {
                    lte: new Date(endDate)
                };
            }

            // 3. Buscar entregas paginadas e contagem total
            const [orderDeliveries, totalDeliveries] = await Promise.all([
                prismaClient.orderDelivery.findMany({
                    where: whereClause,
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
                    },
                    skip,
                    take: pageSize
                }),
                prismaClient.orderDelivery.count({
                    where: whereClause
                })
            ]);

            // 4. Formatar dados das entregas (paginadas)
            const deliveries: IDeliveryItem[] = orderDeliveries.map(delivery => ({
                id: delivery.id,
                order_code: delivery.order.code,
                order_id: delivery.order_id,
                delivery_date: delivery.delivery_date,
                delivery_fee: delivery.order.delivery_fee,
                is_paid: delivery.is_paid
            }));

            // 5. Buscar todas as entregas para summary e history (sem paginação)
            const allOrderDeliveries = await prismaClient.orderDelivery.findMany({
                where: whereClause,
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

            // 6. Criar histórico de entregas agrupado por data (para o gráfico)
            const historyMap = new Map<string, { count: number, total: number }>();
            
            allOrderDeliveries.forEach(delivery => {
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

            // 7. Calcular dados do resumo (cards do topo)
            const totalDeliveriesCount = allOrderDeliveries.length;
            const totalPaid = allOrderDeliveries
                .filter(d => d.is_paid)
                .reduce((sum, d) => sum + d.order.delivery_fee, 0);
            const pendingPayment = allOrderDeliveries
                .filter(d => !d.is_paid)
                .reduce((sum, d) => sum + d.order.delivery_fee, 0);

            // 8. Retornar objeto completo com paginação
            return {
                deliveryMan: {
                    name: deliveryMan.name,
                    phone_number: deliveryMan.phone_number
                },
                deliveries,
                deliveryHistory,
                summary: {
                    total_deliveries: totalDeliveriesCount,
                    total_paid: totalPaid,
                    pending_payment: pendingPayment
                },
                pagination: {
                    total: totalDeliveries,
                    currentPage: page,
                    totalPages: Math.ceil(totalDeliveries / pageSize)
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
