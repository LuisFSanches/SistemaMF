import prismaClient from '../../prisma';

export class SearchProductsService {
    async execute(query: string) {
        if (!query) return [];

        const products = await prismaClient.$queryRawUnsafe(
            `
                SELECT * FROM "products"
                WHERE unaccent(lower(name)) LIKE '%' || unaccent(lower($1)) || '%'
                ORDER BY name
                LIMIT 10
            `,
            query
        );

        return products;
    }
}

