import { IProductSalesReportFilters, IProductSalesReportResponse, IProductSalesReportItem } from "../../interfaces/reports/IProductSalesReport";
import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class GetProductSalesReportService {
    async execute(filters: IProductSalesReportFilters): Promise<IProductSalesReportResponse> {
        try {
            // Paginação com valores padrão
            const page = filters.page || 1;
            const pageSize = filters.pageSize || 50;
            const skip = (page - 1) * pageSize;

            // Construir WHERE clause dinâmica
            const conditions: string[] = ['1=1']; // Condição base sempre verdadeira
            const params: any[] = [];
            let paramIndex = 1;

            // Filtro de data
            if (filters.start_date) {
                conditions.push(`o.created_at >= $${paramIndex}`);
                params.push(new Date(filters.start_date));
                paramIndex++;
            }

            if (filters.end_date) {
                conditions.push(`o.created_at <= $${paramIndex}`);
                params.push(new Date(filters.end_date));
                paramIndex++;
            }

            // Filtro de nome do produto (case-insensitive)
            if (filters.product_name) {
                conditions.push(`(p.name ILIKE $${paramIndex} OR p2.name ILIKE $${paramIndex})`);
                params.push(`%${filters.product_name}%`);
                paramIndex++;
            }

            // Filtro de categoria
            if (filters.category_id) {
                conditions.push(`(
                    EXISTS (
                        SELECT 1 FROM "product_categories" pc 
                        WHERE pc.product_id = p.id AND pc.category_id = $${paramIndex}
                    )
                    OR EXISTS (
                        SELECT 1 FROM "product_categories" pc 
                        WHERE pc.product_id = p2.id AND pc.category_id = $${paramIndex}
                    )
                )`);
                params.push(filters.category_id);
                paramIndex++;
            }

            const whereClause = conditions.join(' AND ');

            // Query principal com agregação e paginação
            const dataQuery = `
                SELECT 
                    COALESCE(p.id, p2.id) as id,
                    COALESCE(p.name, p2.name) as name,
                    COALESCE(p.image, p2.image) as image,
                    CAST(SUM(oi.quantity) AS INTEGER) as quantity_sold
                FROM "order_items" oi
                INNER JOIN "orders" o ON oi.order_id = o.id
                LEFT JOIN "products" p ON oi.product_id = p.id
                LEFT JOIN "store_products" sp ON oi.store_product_id = sp.id
                LEFT JOIN "products" p2 ON sp.product_id = p2.id
                WHERE ${whereClause}
                    AND (p.id IS NOT NULL OR p2.id IS NOT NULL)
                GROUP BY 
                    COALESCE(p.id, p2.id),
                    COALESCE(p.name, p2.name),
                    COALESCE(p.image, p2.image)
                ORDER BY quantity_sold DESC
                LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
            `;

            // Query de contagem total
            const countQuery = `
                SELECT COUNT(DISTINCT COALESCE(p.id, p2.id)) as count
                FROM "order_items" oi
                INNER JOIN "orders" o ON oi.order_id = o.id
                LEFT JOIN "products" p ON oi.product_id = p.id
                LEFT JOIN "store_products" sp ON oi.store_product_id = sp.id
                LEFT JOIN "products" p2 ON sp.product_id = p2.id
                WHERE ${whereClause}
                    AND (p.id IS NOT NULL OR p2.id IS NOT NULL)
            `;

            // Executar queries em paralelo
            const [data, countResult] = await Promise.all([
                prismaClient.$queryRawUnsafe<IProductSalesReportItem[]>(
                    dataQuery,
                    ...params,
                    pageSize,
                    skip
                ),
                prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
                    countQuery,
                    ...params
                )
            ]);

            const total = Number(countResult[0].count);
            const totalPages = Math.ceil(total / pageSize);

            return {
                data,
                total,
                currentPage: page,
                totalPages
            };

        } catch (error: any) {
            console.error("[GetProductSalesReportService] Failed:", error);
            throw new BadRequestException(
                error.message || "Failed to generate product sales report",
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetProductSalesReportService };
