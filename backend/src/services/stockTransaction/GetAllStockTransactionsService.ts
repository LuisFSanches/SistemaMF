import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllStockTransactionsService {
    async execute(page: number = 1, pageSize: number = 10, query?: string, store_id?: string) {
        try {
            const skip = (page - 1) * pageSize;
            let filters: any = {};

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                filters.store_id = store_id;
            }

            if (query) {
                filters.OR = [
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
                ];
            }
            
            const [stockTransaction, total] = await Promise.all([
                prismaClient.stockTransaction.findMany({
                    where: filters as any,
                    include: {
                        product: true,
                        supplierRelation: true,
                    },
                    orderBy: {
                        purchased_date: 'desc'
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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStockTransactionsService };
