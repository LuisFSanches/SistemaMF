import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAllStockTransactionsService {
    async execute(page: number = 1, pageSize: number = 10, query?: string) {
        try {
            const skip = (page - 1) * pageSize;
            const filters = query
                ? {
                    OR: [
                            {
                                product: {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                supplier: {
                                    contains: query,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    }
                : {};
            
            const [stockTransaction, total] = await Promise.all([
                prismaClient.stockTransaction.findMany({
                    where: filters as any,
                    include: {
                        product: true,
                    },
                    orderBy: {
                        created_at: 'desc'
                    },
                    skip,
                    take: pageSize
                }),
                prismaClient.stockTransaction.count({
                    where: filters as any
                })
            ]);

            return {
                stockTransactions: stockTransaction,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error: any) {
            console.log("[GetAllStockTransactionsService] Error:", error.message);
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR };
        }
    }
}

export { GetAllStockTransactionsService };
