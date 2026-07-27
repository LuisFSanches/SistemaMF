import prismaClient from "../../prisma";

class ListPublicProducts3DModelsService {
    async execute(query: string) {
        const products = await prismaClient.product.findMany({
            where: {
                model3d: { isNot: null },
                enabled: true,
                ...(query ? { name: { contains: query, mode: 'insensitive' } } : {}),
            },
            select: {
                id: true,
                name: true,
                image: true,
                categories: {
                    include: { category: true },
                },
                model3d: {
                    select: { model_url: true },
                },
            },
            orderBy: { name: 'asc' },
        });

        return products;
    }
}

export { ListPublicProducts3DModelsService };
