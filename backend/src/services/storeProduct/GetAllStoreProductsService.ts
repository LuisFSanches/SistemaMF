import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import { loadStoreProductVariants, variantAwareNameCondition } from "../../utils/storeProductVariants";

interface IGetAllStoreProductsRequest {
    store_id: string;
    page?: number;
    pageSize?: number;
    query?: string;
    group_variants?: boolean;
}

class GetAllStoreProductsService {
    async execute({ store_id, page = 1, pageSize = 8, query, group_variants = false }: IGetAllStoreProductsRequest) {
        if (group_variants) {
            return this.executeGrouped({ store_id, page, pageSize, query });
        }

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
                            sp.image as sp_image,
                            sp.image_2 as sp_image_2,
                            sp.image_3 as sp_image_3,
                            sp.description as sp_description,
                            sp.created_at,
                            sp.updated_at,
                            p.id, 
                            p.name, 
                            p.image, 
                            p.image_2,
                            p.image_3,
                            p.description,
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
                    image: sp.sp_image || sp.image,
                    image_2: sp.sp_image_2 || sp.image_2,
                    image_3: sp.sp_image_3 || sp.image_3,
                    description: sp.sp_description || sp.description,
                    is_image_from_parent: !sp.sp_image,
                    is_image_2_from_parent: !sp.sp_image_2,
                    is_image_3_from_parent: !sp.sp_image_3,
                    is_description_from_parent: !sp.sp_description,
                    unity: sp.unity,
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
                            sp.image as sp_image,
                            sp.image_2 as sp_image_2,
                            sp.image_3 as sp_image_3,
                            sp.description as sp_description,
                            sp.created_at,
                            sp.updated_at,
                            p.id, 
                            p.name, 
                            p.image, 
                            p.image_2,
                            p.image_3,
                            p.description,
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
                image: sp.sp_image || sp.image,
                image_2: sp.sp_image_2 || sp.image_2,
                image_3: sp.sp_image_3 || sp.image_3,
                description: sp.sp_description || sp.description,
                is_image_from_parent: !sp.sp_image,
                is_image_2_from_parent: !sp.sp_image_2,
                is_image_3_from_parent: !sp.sp_image_3,
                is_description_from_parent: !sp.sp_description,
                unity: sp.unity,
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

    // PDV listing: products of the same variant group are collapsed into a single card
    // (the best-selling color represents the group) with the other colors in `variants`.
    private async executeGrouped({ store_id, page = 1, pageSize = 8, query }: IGetAllStoreProductsRequest) {
        try {
            const skip = (page - 1) * pageSize;
            const searchTerms = query && query.trim()
                ? query.trim().split(/\s+/).filter(term => term.length > 0)
                : [];

            const searchCondition = searchTerms
                .map((_, index) => `AND ${variantAwareNameCondition(index + 2)}`)
                .join(' ');

            const baseFrom = `
                FROM "store_products" sp
                INNER JOIN "products" p ON sp.product_id = p.id
                LEFT JOIN "product_variant_groups" g ON g.id = p.variant_group_id
                WHERE sp.store_id = $1
                AND sp.enabled = true
                ${searchCondition}
            `;

            const [rows, totalResult] = await Promise.all([
                prismaClient.$queryRawUnsafe<any[]>(
                    `
                        SELECT * FROM (
                            SELECT
                                sp.id as store_product_id,
                                sp.store_id,
                                sp.product_id,
                                sp.price,
                                sp.stock,
                                sp.enabled,
                                sp.visible_for_online_store,
                                sp.image as sp_image,
                                sp.description as sp_description,
                                p.name,
                                p.image,
                                p.description,
                                p.unity,
                                p.qr_code,
                                p.sales_count,
                                p.variant_group_id,
                                g.name as variant_group_name,
                                ROW_NUMBER() OVER (
                                    PARTITION BY COALESCE(p.variant_group_id, p.id)
                                    ORDER BY p.sales_count DESC, p.name ASC
                                ) as group_rank,
                                SUM(p.sales_count) OVER (
                                    PARTITION BY COALESCE(p.variant_group_id, p.id)
                                ) as group_sales
                            ${baseFrom}
                        ) ranked
                        WHERE ranked.group_rank = 1
                        ORDER BY ranked.group_sales DESC, COALESCE(ranked.variant_group_name, ranked.name) ASC
                        LIMIT $${searchTerms.length + 2} OFFSET $${searchTerms.length + 3}
                    `,
                    store_id,
                    ...searchTerms,
                    pageSize,
                    skip
                ),
                prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
                    `SELECT COUNT(DISTINCT COALESCE(p.variant_group_id, p.id)) as count ${baseFrom}`,
                    store_id,
                    ...searchTerms
                ),
            ]);

            const variantsByGroup = await loadStoreProductVariants(
                store_id,
                rows.map(row => row.variant_group_id).filter(Boolean)
            );

            const storeProducts = rows.map(row => ({
                id: row.store_product_id,
                store_id: row.store_id,
                product_id: row.product_id,
                name: row.name,
                image: row.sp_image || row.image,
                description: row.sp_description || row.description,
                unity: row.unity,
                price: row.price,
                stock: row.stock,
                enabled: row.enabled,
                visible_for_online_store: row.visible_for_online_store,
                parent_product: {
                    qr_code: row.qr_code,
                },
                variant_group: row.variant_group_id
                    ? { id: row.variant_group_id, name: row.variant_group_name }
                    : null,
                variants: row.variant_group_id ? variantsByGroup.get(row.variant_group_id) || [] : [],
            }));

            const total = Number(totalResult[0].count);

            return {
                products: storeProducts,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error: any) {
            console.error("[GetAllStoreProductsService] Failed (grouped):", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoreProductsService };
