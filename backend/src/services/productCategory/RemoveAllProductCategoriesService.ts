import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IRemoveAllProductCategoriesRequest {
    product_id: string
}

class RemoveAllProductCategoriesService {
    async execute({ product_id }: IRemoveAllProductCategoriesRequest) {
        try {
            // Verificar se produto existe
            const product = await prismaClient.product.findUnique({
                where: { id: product_id },
            });

            if (!product) {
                throw new BadRequestException(
                    "Product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Deletar todas as categorias do produto
            const result = await prismaClient.productCategory.deleteMany({
                where: { product_id }
            });

            return { 
                message: "All categories removed from product successfully",
                count: result.count
            };
        } catch (error: any) {
            console.error("[RemoveAllProductCategoriesService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { RemoveAllProductCategoriesService };
