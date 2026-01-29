import { IProductCategory } from "../../interfaces/IProductCategory";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { addProductCategorySchema } from "../../schemas/productCategory/addProductCategory";
import { BadRequestException } from "../../exceptions/bad-request";

class AddProductCategoryService {
    async execute(data: IProductCategory) {
        // 1. Validação com Zod
        const parsed = addProductCategorySchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se produto existe
        const product = await prismaClient.product.findUnique({
            where: { id: data.product_id },
        });

        if (!product) {
            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 3. Verificar se categoria existe
        const category = await prismaClient.category.findUnique({
            where: { id: data.category_id },
        });

        if (!category) {
            throw new BadRequestException(
                "Category not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 4. Verificar se relação já existe
        const existingRelation = await prismaClient.productCategory.findFirst({
            where: {
                product_id: data.product_id,
                category_id: data.category_id,
            },
        });

        if (existingRelation) {
            throw new BadRequestException(
                "Product already has this category",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // 5. Criar relação
        try {
            const productCategory = await prismaClient.productCategory.create({
                data: {
                    product_id: data.product_id,
                    category_id: data.category_id,
                },
                include: {
                    product: {
                        select: { id: true, name: true }
                    },
                    category: {
                        select: { id: true, name: true, slug: true }
                    }
                }
            });

            return productCategory;
        } catch (error: any) {
            console.error("[AddProductCategoryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { AddProductCategoryService };
