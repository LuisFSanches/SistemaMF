import prismaClient from '../../prisma';

export class SearchStoreProductsService {
    async execute(query: string, store_id?: string | null) {
        if (!query) return [];

        try {
            let sqlQuery = `
                SELECT sp.*, p.name, p.image, p.qr_code
                FROM "store_products" sp
                INNER JOIN "products" p ON sp.product_id = p.id
                WHERE sp.enabled = true
                AND replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || replace(unaccent(lower($1)), ' ', '') || '%'
            `;

            // Se store_id for fornecido, filtrar apenas produtos daquela loja
            if (store_id) {
                sqlQuery += `
                    AND sp.store_id = $2
                `;
            }

            sqlQuery += `
                ORDER BY p.name
                LIMIT 50
            `;

            const products = store_id
                ? await prismaClient.$queryRawUnsafe(sqlQuery, query, store_id)
                : await prismaClient.$queryRawUnsafe(sqlQuery, query);
            return products;
        } catch (error) {
            console.error('Error executing search query:', error);
            throw error;
        }
    }
}
