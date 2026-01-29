import { ICategory } from "../../interfaces/ICategory";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateCategorySchema } from "../../schemas/category/updateCategory";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateCategoryRequest extends Partial<ICategory> {
    id: string
}

class UpdateCategoryService {
    async execute({ id, ...data }: IUpdateCategoryRequest) {
        // 1. Validação com Zod
        const parsed = updateCategorySchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se categoria existe
        const existingCategory = await prismaClient.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw new BadRequestException(
                "Category not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 3. Verificar se slug já está em uso (se está sendo atualizado)
        if (data.slug && data.slug !== existingCategory.slug) {
            const categoryWithSlug = await prismaClient.category.findFirst({
                where: { slug: data.slug },
            });

            if (categoryWithSlug) {
                throw new BadRequestException(
                    "Category with this slug already exists",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        // 4. Operação no banco
        try {
            const category = await prismaClient.category.update({
                where: { id },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.slug && { slug: data.slug }),
                }
            });

            return category;
        } catch (error: any) {
            console.error("[UpdateCategoryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateCategoryService };
