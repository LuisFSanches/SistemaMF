import { IReportFilters, ISalesReportResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import { reportFiltersSchema } from "../../schemas/reports/reportFilters";

class GetSalesReportService {
    async execute(filters: IReportFilters): Promise<ISalesReportResponse> {
        // Validação
        const parsed = reportFiltersSchema.safeParse(filters);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // Construir where clause
            const whereClause: any = {};

            if (filters.start_date) {
                whereClause.created_at = {
                    ...whereClause.created_at,
                    gte: new Date(filters.start_date)
                };
            }

            if (filters.end_date) {
                whereClause.created_at = {
                    ...whereClause.created_at,
                    lte: new Date(filters.end_date)
                };
            }

            if (filters.status) {
                whereClause.status = filters.status;
            }

            if (filters.payment_method) {
                whereClause.payment_method = filters.payment_method;
            }

            if (filters.client_id) {
                whereClause.client_id = filters.client_id;
            }

            if (filters.online_order !== undefined) {
                whereClause.online_order = filters.online_order;
            }

            if (filters.store_front_order !== undefined) {
                whereClause.store_front_order = filters.store_front_order;
            }

            if (filters.payment_received !== undefined) {
                whereClause.payment_received = filters.payment_received;
            }

            // Buscar pedidos
            const orders = await prismaClient.order.findMany({
                where: whereClause,
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            // Calcular métricas
            const total_orders = orders.length;
            const total_revenue = orders.reduce((sum, order) => sum + order.total, 0);
            const total_delivery_fees = orders.reduce((sum, order) => sum + order.delivery_fee, 0);
            const total_discounts = orders.reduce((sum, order) => sum + order.discount, 0);
            
            let total_products_sold = 0;
            orders.forEach(order => {
                order.orderItems.forEach(item => {
                    total_products_sold += item.quantity;
                });
            });

            const average_ticket = total_orders > 0 ? total_revenue / total_orders : 0;

            // Pedidos por status
            const statusMap = new Map<string, { count: number, total_value: number }>();
            orders.forEach(order => {
                const current = statusMap.get(order.status) || { count: 0, total_value: 0 };
                statusMap.set(order.status, {
                    count: current.count + 1,
                    total_value: current.total_value + order.total
                });
            });

            const orders_by_status = Array.from(statusMap.entries()).map(([status, data]) => ({
                status,
                count: data.count,
                total_value: data.total_value
            }));

            // Pedidos por método de pagamento
            const paymentMap = new Map<string, { count: number, total_value: number }>();
            orders.forEach(order => {
                const method = order.payment_method || 'Não informado';
                const current = paymentMap.get(method) || { count: 0, total_value: 0 };
                paymentMap.set(method, {
                    count: current.count + 1,
                    total_value: current.total_value + order.total
                });
            });

            const orders_by_payment_method = Array.from(paymentMap.entries()).map(([payment_method, data]) => ({
                payment_method,
                count: data.count,
                total_value: data.total_value
            }));

            // Vendas diárias
            const dailyMap = new Map<string, { orders_count: number, total_value: number }>();
            orders.forEach(order => {
                const date = new Date(order.created_at!).toISOString().split('T')[0];
                const current = dailyMap.get(date) || { orders_count: 0, total_value: 0 };
                dailyMap.set(date, {
                    orders_count: current.orders_count + 1,
                    total_value: current.total_value + order.total
                });
            });

            const daily_sales = Array.from(dailyMap.entries())
                .map(([date, data]) => ({
                    date,
                    orders_count: data.orders_count,
                    total_value: data.total_value
                }))
                .sort((a, b) => a.date.localeCompare(b.date));

            return {
                total_orders,
                total_revenue,
                total_products_sold,
                total_delivery_fees,
                total_discounts,
                average_ticket,
                orders_by_status,
                orders_by_payment_method,
                daily_sales
            };

        } catch (error: any) {
            console.error("[GetSalesReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate sales report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetSalesReportService };
