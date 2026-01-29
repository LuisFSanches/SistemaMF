import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetProductCategoriesRequest {
    product_id: string
}

class GetProductCategoriesService {
    async execute({ product_id }: IGetProductCategoriesRequest) {
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

            // Buscar categorias do produto
            const productCategories = await prismaClient.productCategory.findMany({
                where: { product_id },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            created_at: true,
                            updated_at: true
                        }
                    }
                },
                orderBy: {
                    category: {
                        name: 'asc'
                    }
                }
            });

            return productCategories;
        } catch (error: any) {
            console.error("[GetProductCategoriesService] Failed:", error);

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

export { GetProductCategoriesService };
