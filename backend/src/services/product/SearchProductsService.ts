import prismaClient from '../../prisma';

export class SearchProductsService {
    async execute(query: string, store_id?: string | null) {
        if (!query) return [];

        let sqlQuery = `
            SELECT * FROM "products"
            WHERE enabled = true
            AND replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($1)), ' ', '') || '%'
        `;

        // Se store_id for fornecido, excluir produtos que o lojista já possui
        if (store_id) {
            sqlQuery += `
                AND id NOT IN (
                    SELECT product_id FROM "store_products"
                    WHERE store_id = $2
                )
            `;
        }

        sqlQuery += `
            ORDER BY name
            LIMIT 50
        `;

        const products = store_id
            ? await prismaClient.$queryRawUnsafe(sqlQuery, query, store_id)
            : await prismaClient.$queryRawUnsafe(sqlQuery, query);

        return products;
    }
}
