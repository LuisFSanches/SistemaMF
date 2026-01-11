import { IReportFilters, ITopProductsResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetTopProductsReportService {
    async execute(filters: IReportFilters): Promise<ITopProductsResponse[]> {
        try {
            // Construir where clause para orders
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

            // Buscar todos os pedidos no período
            const orders = await prismaClient.order.findMany({
                where: whereClause,
                include: {
                    orderItems: {
                        include: {
                            product: true,
                            storeProduct: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    }
                }
            });

            // Agregar dados por produto
            const productMap = new Map<string, {
                id: string,
                name: string,
                total_quantity: number,
                total_revenue: number,
                order_count: number,
                prices: number[]
            }>();

            orders.forEach(order => {
                order.orderItems.forEach(item => {
                    // Determinar qual produto usar (storeProduct tem prioridade sobre product direto)
                    const productData = item.storeProduct?.product || item.product;
                    
                    // Pular item se não houver produto associado
                    if (!productData) {
                        return;
                    }

                    const productId = productData.id;
                    const productName = productData.name;

                    const existing = productMap.get(productId) || {
                        id: productId,
                        name: productName,
                        total_quantity: 0,
                        total_revenue: 0,
                        order_count: 0,
                        prices: []
                    };

                    existing.total_quantity += item.quantity;
                    existing.total_revenue += item.price * item.quantity;
                    existing.order_count += 1;
                    existing.prices.push(item.price);

                    productMap.set(productId, existing);
                });
            });

            // Converter para array e calcular médias
            const limit = filters.limit || 50; // Padrão: 50 produtos
            const offset = filters.offset || 0;
            
            const allProducts = Array.from(productMap.values())
                .map(product => ({
                    id: product.id,
                    name: product.name,
                    total_quantity: product.total_quantity,
                    total_revenue: product.total_revenue,
                    order_count: product.order_count,
                    average_price: product.prices.reduce((a, b) => a + b, 0) / product.prices.length
                }))
                .sort((a, b) => b.total_revenue - a.total_revenue);

            // Aplicar paginação
            const topProducts = allProducts.slice(offset, offset + limit);

            return topProducts;

        } catch (error: any) {
            console.error("[GetTopProductsReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate top products report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetTopProductsReportService };
