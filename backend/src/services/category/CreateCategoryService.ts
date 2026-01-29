import { ICategory } from "../../interfaces/ICategory";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createCategorySchema } from "../../schemas/category/createCategory";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateCategoryService {
    async execute(data: ICategory) {
        // 1. Validação com Zod
        const parsed = createCategorySchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Validações de negócio - verificar se slug já existe
        const existingCategory = await prismaClient.category.findFirst({
            where: { slug: data.slug },
        });

        if (existingCategory) {
            throw new BadRequestException(
                "Category with this slug already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // 3. Operação no banco
        try {
            const category = await prismaClient.category.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                }
            });

            return category;
        } catch (error: any) {
            console.error("[CreateCategoryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateCategoryService };
