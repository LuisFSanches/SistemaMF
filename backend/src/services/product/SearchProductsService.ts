import prismaClient from '../../prisma';

export class SearchProductsService {
    async execute(query: string) {
        if (!query) return [];

        const products = await prismaClient.$queryRawUnsafe(
            `
                SELECT * FROM "products"
                WHERE enabled = true
                AND replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($1)), ' ', '') || '%'
                ORDER BY name
                LIMIT 50
            `,
            query
        );

        return products;
    }
}
