import prismaClient from "../../prisma";

class ListProducts3DModelsService {
    async execute(query: string) {
        const products = await prismaClient.product.findMany({
            where: {
                model3d: { isNot: null },
                ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
            },
            include: {
                model3d: true,
                categories: {
                    include: { category: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        return products;
    }
}

export { ListProducts3DModelsService };
