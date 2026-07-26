import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { ISupplierStockDetails, ISupplierStockTransactionDetails, ISupplierStockMetrics } from "../../interfaces/ISupplierStockDetails";

class GetSupplierStockDetailsService {
    async execute(supplier_id: string, store_id?: string): Promise<ISupplierStockDetails> {
        try {
            const supplierWhereClause: any = { id: supplier_id };
            if (store_id) {
                supplierWhereClause.store_id = store_id;
            }

            const supplier = await prismaClient.supplier.findFirst({
                where: supplierWhereClause,
                select: {
                    id: true,
                    name: true
                }
            });

            if (!supplier) {
                throw new BadRequestException(
                    "Supplier not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            const whereClause: any = { supplier_id };
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const transactions = await prismaClient.stockTransaction.findMany({
                where: whereClause,
                include: {
                    storeProduct: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    purchased_date: 'desc'
                }
            });

            const formattedTransactions: ISupplierStockTransactionDetails[] = transactions.map(transaction => ({
                id: transaction.id,
                purchased_date: transaction.purchased_date,
                product_name: transaction.storeProduct?.product?.name || '',
                unity: transaction.unity,
                quantity: transaction.quantity,
                unity_price: transaction.unity_price,
                total_price: transaction.total_price
            }));

            const totalQuantityPurchased = transactions.reduce(
                (sum, transaction) => sum + transaction.quantity,
                0
            );

            const totalSpent = transactions.reduce(
                (sum, transaction) => sum + transaction.total_price,
                0
            );

            const averagePrice = transactions.length > 0
                ? transactions.reduce((sum, transaction) => sum + transaction.unity_price, 0) / transactions.length
                : 0;

            const lastPurchaseDate = transactions.length > 0
                ? transactions[0].purchased_date
                : null;

            const metrics: ISupplierStockMetrics = {
                total_transactions: transactions.length,
                total_quantity_purchased: totalQuantityPurchased,
                total_spent: totalSpent,
                average_price: averagePrice,
                last_purchase_date: lastPurchaseDate
            };

            return {
                supplier_info: {
                    id: supplier.id,
                    name: supplier.name
                },
                transactions: formattedTransactions,
                metrics
            };

        } catch (error: any) {
            console.error("[GetSupplierStockDetailsService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetSupplierStockDetailsService };
