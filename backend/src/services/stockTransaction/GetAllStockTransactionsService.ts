import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllStockTransactionsService {
    async execute(page: number = 1, pageSize: number = 10, query?: string, store_id?: string, supplier_id?: string) {
        try {
            const skip = (page - 1) * pageSize;
            let filters: any = {};

            // Filtro por loja (multi-tenancy)
            if (store_id) {
                filters.store_id = store_id;
            }

            if (supplier_id) {
                filters.supplier_id = supplier_id;
            }

            if (query && query.trim()) {
                const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);

                const conditions = searchTerms.map((_, index) =>
                    `replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
                ).join(' AND ');

                const matchingIds = await prismaClient.$queryRawUnsafe<{ id: string }[]>(
                    `
                        SELECT st.id
                        FROM "stock_transactions" st
                        INNER JOIN "store_products" sp ON st.store_product_id = sp.id
                        INNER JOIN "products" p ON sp.product_id = p.id
                        WHERE ${conditions}
                    `,
                    ...searchTerms
                );

                filters.id = { in: matchingIds.map(row => row.id) };
            }

            const [stockTransaction, total] = await Promise.all([
                prismaClient.stockTransaction.findMany({
                    where: filters as any,
                    include: {
                        product: {
                            select: {
                                name: true,
                                image: true
                            }
                        },
                        storeProduct: {
                            include: {
                                product: {
                                    select: {
                                        name: true,
                                        image: true
                                    }
                                }
                            }
                        },
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
