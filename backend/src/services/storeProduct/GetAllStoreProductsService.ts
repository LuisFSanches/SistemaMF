import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetAllStoreProductsRequest {
    store_id: string;
    page?: number;
    pageSize?: number;
    query?: string;
}

class GetAllStoreProductsService {
    async execute({ store_id, page = 1, pageSize = 8, query }: IGetAllStoreProductsRequest) {
        try {
            const skip = (page - 1) * pageSize;

            if (query && query.trim()) {
                const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
                
                const conditions = searchTerms.map((_, index) => 
                    `replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
                ).join(' AND ');

                const queryParams = [...searchTerms, store_id, pageSize, skip];

                const storeProductsRaw = await prismaClient.$queryRawUnsafe<any[]>(
                    `
                        SELECT 
                            sp.id as store_product_id,
                            sp.store_id,
                            sp.product_id,
                            sp.price,
                            sp.stock,
                            sp.enabled,
                            sp.visible_for_online_store,
                            sp.created_at,
                            sp.updated_at,
                            p.id, 
                            p.name, 
                            p.image, 
                            p.unity, 
                            p.qr_code, 
                            p.visible_in_store, 
                            p.sales_count
                        FROM "store_products" sp
                        INNER JOIN "products" p ON sp.product_id = p.id
                        WHERE sp.store_id = $${searchTerms.length + 1}
                        AND sp.enabled = true
                        AND ${conditions}
                        ORDER BY p.sales_count DESC, p.name ASC
                        LIMIT $${searchTerms.length + 2} OFFSET $${searchTerms.length + 3}
                    `,
                    ...queryParams
                );

                const storeProducts = storeProductsRaw.map(sp => ({
                    id: sp.store_product_id,
                    store_id: sp.store_id,
                    product_id: sp.product_id,
                    name: sp.name,
                    image: sp.image,
                    price: sp.price,
                    stock: sp.stock,
                    enabled: sp.enabled,
                    visible_for_online_store: sp.visible_for_online_store,
                    created_at: sp.created_at,
                    updated_at: sp.updated_at,
                    parent_product: {
                        qr_code: sp.qr_code,
                    }
                }));

                const totalQueryParams = [...searchTerms, store_id];

                const totalResult = await prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
                    `
                        SELECT COUNT(*) as count
                        FROM "store_products" sp
                        INNER JOIN "products" p ON sp.product_id = p.id
                        WHERE sp.store_id = $${searchTerms.length + 1}
                        AND sp.enabled = true
                        AND ${conditions}
                    `,
                    ...totalQueryParams
                );

                const total = Number(totalResult[0].count);

                return {
                    products: storeProducts,
                    total,
                    currentPage: page,
                    totalPages: Math.ceil(total / pageSize)
                };
            }

            const [storeProductsRaw, total] = await Promise.all([
                prismaClient.$queryRawUnsafe<any[]>(
                    `
                        SELECT 
                            sp.id as store_product_id,
                            sp.store_id,
                            sp.product_id,
                            sp.price,
                            sp.stock,
                            sp.enabled,
                            sp.visible_for_online_store,
                            sp.created_at,
                            sp.updated_at,
                            p.id, 
                            p.name, 
                            p.image, 
                            p.unity, 
                            p.qr_code, 
                            p.visible_in_store, 
                            p.sales_count
                        FROM "store_products" sp
                        INNER JOIN "products" p ON sp.product_id = p.id
                        WHERE sp.store_id = $1
                        AND sp.enabled = true
                        ORDER BY p.sales_count DESC, p.name ASC
                        LIMIT $2 OFFSET $3
                    `,
                    store_id,
                    pageSize,
                    skip
                ),
                prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
                    `
                        SELECT COUNT(*) as count
                        FROM "store_products" sp
                        INNER JOIN "products" p ON sp.product_id = p.id
                        WHERE sp.store_id = $1
                        AND sp.enabled = true
                    `,
                    store_id
                ).then(result => Number(result[0].count))
            ]);

            const storeProducts = storeProductsRaw.map(sp => ({
                id: sp.store_product_id,
                store_id: sp.store_id,
                name: sp.name,
                image: sp.image,
                price: sp.price,
                stock: sp.stock,
                enabled: sp.enabled,
                visible_in_store: sp.visible_for_online_store,
                created_at: sp.created_at,
                updated_at: sp.updated_at,
                parent_product: {
                    qr_code: sp.qr_code,
                }
            }));

            return {
                products: storeProducts,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };

        } catch (error: any) {
            console.error("[GetAllStoreProductsService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoreProductsService };
