import { IReportFilters, IFinancialReportResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import { reportFiltersSchema } from "../../schemas/reports/reportFilters";

class GetFinancialReportService {
    async execute(filters: IReportFilters): Promise<IFinancialReportResponse> {
        // Validação
        const parsed = reportFiltersSchema.safeParse(filters);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const period_start = filters.start_date 
                ? new Date(filters.start_date).toISOString() 
                : new Date(new Date().getFullYear(), 0, 1).toISOString();
            
            const period_end = filters.end_date 
                ? new Date(filters.end_date).toISOString() 
                : new Date().toISOString();

            // Buscar pedidos
            const orders = await prismaClient.order.findMany({
                where: {
                    created_at: {
                        gte: new Date(period_start),
                        lte: new Date(period_end)
                    }
                }
            });

            // Buscar transações de estoque (custos)
            const stockTransactions = await prismaClient.stockTransaction.findMany({
                where: {
                    purchased_date: {
                        gte: new Date(period_start),
                        lte: new Date(period_end)
                    }
                }
            });

            // Calcular receitas
            const total_revenue = orders.reduce((sum, order) => sum + order.total, 0);
            const total_discounts = orders.reduce((sum, order) => sum + order.discount, 0);
            const total_delivery_fees = orders.reduce((sum, order) => sum + order.delivery_fee, 0);

            // Calcular custos
            const total_costs = stockTransactions.reduce((sum, transaction) => sum + transaction.total_price, 0);

            // Lucro bruto
            const gross_profit = total_revenue - total_costs;

            // Métricas de pedidos
            const total_orders = orders.length;
            const total_orders_paid = orders.filter(o => o.payment_received).length;
            const total_orders_pending = orders.filter(o => !o.payment_received).length;

            const paid_amount = orders
                .filter(o => o.payment_received)
                .reduce((sum, order) => sum + order.total, 0);

            const pending_amount = orders
                .filter(o => !o.payment_received)
                .reduce((sum, order) => sum + order.total, 0);

            // Breakdown por método de pagamento
            const paymentMap = new Map<string, { count: number, total: number }>();
            orders.forEach(order => {
                const method = order.payment_method || 'Não informado';
                const current = paymentMap.get(method) || { count: 0, total: 0 };
                paymentMap.set(method, {
                    count: current.count + 1,
                    total: current.total + order.total
                });
            });

            const breakdown_by_payment_method = Array.from(paymentMap.entries()).map(([payment_method, data]) => ({
                payment_method,
                count: data.count,
                total: data.total
            }));

            return {
                period_start,
                period_end,
                total_revenue,
                total_costs,
                gross_profit,
                total_orders,
                total_orders_paid,
                total_orders_pending,
                pending_amount,
                paid_amount,
                total_discounts,
                total_delivery_fees,
                breakdown_by_payment_method
            };

        } catch (error: any) {
            console.error("[GetFinancialReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate financial report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetFinancialReportService };
