import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { IProductStockDetails, IStockTransactionDetails, IPriceHistory, IStockMetrics } from "../../interfaces/IProductStockDetails";

class GetProductStockDetailsService {
    async execute(store_product_id: string, store_id?: string): Promise<IProductStockDetails> {
        try {
            // 1. Verificar se o store_product existe e buscar informações básicas
            const storeProduct = await prismaClient.storeProduct.findUnique({
                where: { id: store_product_id },
                select: {
                    id: true,
                    stock: true,
                    price: true,
                    product: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                }
            });

            if (!storeProduct) {
                throw new BadRequestException(
                    "Store product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 2. Buscar todas as transações do store_product
            const whereClause: any = { store_product_id };
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const transactions = await prismaClient.stockTransaction.findMany({
                where: whereClause,
                include: {
                    supplierRelation: true
                },
                orderBy: {
                    purchased_date: 'desc'
                }
            });

            // 3. Formatar transações
            const formattedTransactions: IStockTransactionDetails[] = transactions.map(transaction => ({
                id: transaction.id,
                purchased_date: transaction.purchased_date,
                supplier: transaction.supplierRelation?.name || transaction.supplier,
                unity: transaction.unity,
                quantity: transaction.quantity,
                unity_price: transaction.unity_price,
                total_price: transaction.total_price
            }));

            // 4. Criar histórico de preços (ordenado por data)
            const priceHistory: IPriceHistory[] = transactions
                .map(transaction => ({
                    date: transaction.purchased_date,
                    unity_price: transaction.unity_price
                }))
                .sort((a, b) => a.date.getTime() - b.date.getTime());

            // 5. Calcular métricas
            const totalQuantityPurchased = transactions.reduce(
                (sum, transaction) => sum + transaction.quantity, 
                0
            );

            const averagePrice = transactions.length > 0
                ? transactions.reduce((sum, transaction) => sum + transaction.unity_price, 0) / transactions.length
                : 0;

            const lastPurchaseDate = transactions.length > 0
                ? transactions[0].purchased_date
                : null;

            const metrics: IStockMetrics = {
                total_quantity_purchased: totalQuantityPurchased,
                current_stock: storeProduct.stock,
                average_price: averagePrice,
                last_purchase_date: lastPurchaseDate
            };

            // 6. Montar o objeto de retorno
            return {
                product_info: {
                    id: storeProduct.id,
                    name: storeProduct.product.name,
                    image: storeProduct.product.image,
                    price: storeProduct.price
                },
                transactions: formattedTransactions,
                price_history: priceHistory,
                metrics
            };

        } catch (error: any) {
            console.error("[GetProductStockDetailsService] Failed:", error);

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

export { GetProductStockDetailsService };
