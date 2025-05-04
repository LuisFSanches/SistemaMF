import prismaClient from '../../prisma';

export class SearchProductsService {
    async execute(query: string) {
        if (!query) return [];

        const products = await prismaClient.product.findMany({
            where: {
                name: {
                contains: query,
                mode: 'insensitive'
                }
            },
            take: 10,
            orderBy: { name: 'asc' }
        });

        return products;
    }
}
