import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IDeleteCategoryRequest {
    id: string
}

class DeleteCategoryService {
    async execute({ id }: IDeleteCategoryRequest) {
        try {
            // Verificar se categoria existe
            const existingCategory = await prismaClient.category.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            });

            if (!existingCategory) {
                throw new BadRequestException(
                    "Category not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Verificar se há produtos associados
            if (existingCategory._count.products > 0) {
                throw new BadRequestException(
                    `Cannot delete category with ${existingCategory._count.products} associated products`,
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Deletar categoria
            await prismaClient.category.delete({
                where: { id }
            });

            return { message: "Category deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteCategoryService] Failed:", error);

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

export { DeleteCategoryService };
