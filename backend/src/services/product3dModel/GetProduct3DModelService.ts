import prismaClient from "../../prisma";

class GetProduct3DModelService {
    async execute(product_id: string) {
        const model = await prismaClient.product3DModel.findUnique({
            where: { product_id },
        });

        return model;
    }
}

export { GetProduct3DModelService };
