import { IReportFilters, IDeliveryReportResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetDeliveryReportService {
    async execute(filters: IReportFilters): Promise<IDeliveryReportResponse> {
        try {
            // Construir where clause
            const whereClause: any = {};

            if (filters.start_date) {
                whereClause.delivery_date = {
                    ...whereClause.delivery_date,
                    gte: new Date(filters.start_date)
                };
            }

            if (filters.end_date) {
                whereClause.delivery_date = {
                    ...whereClause.delivery_date,
                    lte: new Date(filters.end_date)
                };
            }

            if (filters.delivery_man_id) {
                whereClause.delivery_man_id = filters.delivery_man_id;
            }

            // Buscar entregas
            const deliveries = await prismaClient.orderDelivery.findMany({
                where: whereClause,
                include: {
                    order: true,
                    deliveryMan: true
                }
            });

            // Métricas gerais
            const total_deliveries = deliveries.length;
            const deliveries_paid = deliveries.filter(d => d.is_paid).length;
            const deliveries_pending = deliveries.filter(d => !d.is_paid).length;

            const total_paid_value = deliveries
                .filter(d => d.is_paid)
                .reduce((sum, d) => sum + d.order.delivery_fee, 0);

            const total_pending_value = deliveries
                .filter(d => !d.is_paid)
                .reduce((sum, d) => sum + d.order.delivery_fee, 0);

            // Agrupar por entregador
            const deliveryManMap = new Map<string, {
                id: string,
                name: string,
                phone_number: string,
                total_deliveries: number,
                paid_deliveries: number,
                pending_deliveries: number,
                total_value: number
            }>();

            deliveries.forEach(delivery => {
                const manId = delivery.delivery_man_id;
                const existing = deliveryManMap.get(manId) || {
                    id: delivery.deliveryMan.id,
                    name: delivery.deliveryMan.name,
                    phone_number: delivery.deliveryMan.phone_number,
                    total_deliveries: 0,
                    paid_deliveries: 0,
                    pending_deliveries: 0,
                    total_value: 0
                };

                existing.total_deliveries += 1;
                existing.total_value += delivery.order.delivery_fee;

                if (delivery.is_paid) {
                    existing.paid_deliveries += 1;
                } else {
                    existing.pending_deliveries += 1;
                }

                deliveryManMap.set(manId, existing);
            });

            const deliveries_by_man = Array.from(deliveryManMap.values())
                .sort((a, b) => b.total_deliveries - a.total_deliveries);

            return {
                total_deliveries,
                deliveries_paid,
                deliveries_pending,
                total_paid_value,
                total_pending_value,
                deliveries_by_man
            };

        } catch (error: any) {
            console.error("[GetDeliveryReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate delivery report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetDeliveryReportService };
