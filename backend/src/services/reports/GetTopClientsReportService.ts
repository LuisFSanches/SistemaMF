import { IReportFilters, ITopClientsResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetTopClientsReportService {
    async execute(filters: IReportFilters): Promise<ITopClientsResponse[]> {
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

            // Buscar clientes com seus pedidos
            const clients = await prismaClient.client.findMany({
                include: {
                    orders: {
                        where: whereClause
                    }
                }
            });

            // Processar dados dos clientes
            const limit = filters.limit || 50; // Padrão: 50 clientes
            const offset = filters.offset || 0;
            
            const allClientsData = clients
                .map(client => {
                    const total_orders = client.orders.length;
                    const total_spent = client.orders.reduce((sum, order) => sum + order.total, 0);
                    const average_order_value = total_orders > 0 ? total_spent / total_orders : 0;
                    
                    // Data do último pedido
                    const lastOrder = client.orders.sort((a, b) => 
                        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
                    )[0];

                    return {
                        id: client.id,
                        first_name: client.first_name,
                        last_name: client.last_name,
                        phone_number: client.phone_number,
                        total_orders,
                        total_spent,
                        average_order_value,
                        last_order_date: lastOrder ? lastOrder.created_at! : new Date()
                    };
                })
                .filter(client => client.total_orders > 0) // Apenas clientes com pedidos
                .sort((a, b) => b.total_spent - a.total_spent); // Ordenar por valor gasto

            // Aplicar paginação
            const clientsData = allClientsData.slice(offset, offset + limit);

            return clientsData;

        } catch (error: any) {
            console.error("[GetTopClientsReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate top clients report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetTopClientsReportService };
