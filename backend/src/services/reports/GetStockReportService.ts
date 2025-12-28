import { IStockReportResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetStockReportService {
    async execute(): Promise<IStockReportResponse[]> {
        try {
            // Buscar todos os produtos
            const products = await prismaClient.product.findMany({
                include: {
                    stockTransactions: true,
                    orderItems: {
                        include: {
                            order: true
                        }
                    }
                }
            });

            // Processar dados de cada produto
            const stockReport = products.map(product => {
                // Total comprado (entradas)
                const total_purchased = product.stockTransactions.reduce(
                    (sum, transaction) => sum + transaction.quantity, 
                    0
                );

                // Total vendido
                const total_sold = product.orderItems.reduce(
                    (sum, item) => sum + item.quantity, 
                    0
                );

                // Total investido
                const total_invested = product.stockTransactions.reduce(
                    (sum, transaction) => sum + transaction.total_price, 
                    0
                );

                // Preço médio de compra
                const average_purchase_price = product.stockTransactions.length > 0
                    ? total_invested / total_purchased
                    : 0;

                // Valor atual do estoque
                const current_value = product.stock * average_purchase_price;

                // Status do estoque
                let stock_status: 'low' | 'medium' | 'high';
                if (product.stock < 10) {
                    stock_status = 'low';
                } else if (product.stock < 50) {
                    stock_status = 'medium';
                } else {
                    stock_status = 'high';
                }

                return {
                    id: product.id,
                    name: product.name,
                    current_stock: product.stock,
                    unity: product.unity,
                    total_purchased,
                    total_sold,
                    total_invested,
                    average_purchase_price,
                    current_value,
                    stock_status
                };
            });

            // Ordenar por status de estoque (baixo primeiro)
            const statusOrder = { low: 0, medium: 1, high: 2 };
            stockReport.sort((a, b) => statusOrder[a.stock_status] - statusOrder[b.stock_status]);

            return stockReport;

        } catch (error: any) {
            console.error("[GetStockReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate stock report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStockReportService };
