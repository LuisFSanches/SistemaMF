import { IReportFilters, ISupplierReportResponse } from "../../interfaces/reports/IReportFilters";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetSupplierReportService {
    async execute(filters: IReportFilters): Promise<ISupplierReportResponse[]> {
        try {
            // Construir where clause para transações
            const whereClause: any = {};

            if (filters.start_date) {
                whereClause.purchased_date = {
                    ...whereClause.purchased_date,
                    gte: new Date(filters.start_date)
                };
            }

            if (filters.end_date) {
                whereClause.purchased_date = {
                    ...whereClause.purchased_date,
                    lte: new Date(filters.end_date)
                };
            }

            if (filters.supplier_id) {
                whereClause.supplier_id = filters.supplier_id;
            }

            // Buscar fornecedores com suas transações
            const suppliers = await prismaClient.supplier.findMany({
                include: {
                    stockTransactions: {
                        where: whereClause
                    }
                }
            });

            // Processar dados
            const suppliersData = suppliers
                .map(supplier => {
                    const transactions = supplier.stockTransactions;
                    const total_transactions = transactions.length;
                    const total_invested = transactions.reduce((sum, t) => sum + t.total_price, 0);
                    const total_products_purchased = transactions.reduce((sum, t) => sum + t.quantity, 0);
                    const average_purchase_value = total_transactions > 0 
                        ? total_invested / total_transactions 
                        : 0;

                    // Data da última compra
                    const lastTransaction = transactions.sort((a, b) => 
                        new Date(b.purchased_date).getTime() - new Date(a.purchased_date).getTime()
                    )[0];

                    return {
                        id: supplier.id,
                        name: supplier.name,
                        total_transactions,
                        total_invested,
                        total_products_purchased,
                        average_purchase_value,
                        last_purchase_date: lastTransaction ? lastTransaction.purchased_date : new Date()
                    };
                })
                .filter(s => s.total_transactions > 0) // Apenas fornecedores com transações
                .sort((a, b) => b.total_invested - a.total_invested);

            return suppliersData;

        } catch (error: any) {
            console.error("[GetSupplierReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate supplier report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetSupplierReportService };
