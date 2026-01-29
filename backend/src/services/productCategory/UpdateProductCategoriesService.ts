import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateProductCategoriesSchema } from "../../schemas/productCategory/updateProductCategories";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateProductCategoriesRequest {
    product_id: string
    category_ids: string[]
}

class UpdateProductCategoriesService {
    async execute({ product_id, category_ids }: IUpdateProductCategoriesRequest) {
        // 1. Validação com Zod
        const parsed = updateProductCategoriesSchema.safeParse({ product_id, category_ids });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se produto existe
        const product = await prismaClient.product.findUnique({
            where: { id: product_id },
        });

        if (!product) {
            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 3. Verificar se todas as categorias existem
        const categories = await prismaClient.category.findMany({
            where: {
                id: { in: category_ids }
            }
        });

        if (categories.length !== category_ids.length) {
            throw new BadRequestException(
                "One or more categories not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 4. Remover duplicatas do array
        const uniqueCategoryIds = [...new Set(category_ids)];

        // 5. Usar transação para atualizar categorias
        try {
            const result = await prismaClient.$transaction(async (tx) => {
                // Deletar todas as categorias existentes do produto
                await tx.productCategory.deleteMany({
                    where: { product_id }
                });

                // Criar novas relações
                const newRelations = await tx.productCategory.createMany({
                    data: uniqueCategoryIds.map(category_id => ({
                        product_id,
                        category_id
                    }))
                });

                // Buscar as categorias criadas com seus dados completos
                const productCategories = await tx.productCategory.findMany({
                    where: { product_id },
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
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
            });

            return result;
        } catch (error: any) {
            console.error("[UpdateProductCategoriesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateProductCategoriesService };
