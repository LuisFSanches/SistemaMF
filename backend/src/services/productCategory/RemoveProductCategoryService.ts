import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IRemoveProductCategoryRequest {
    id: string
}

class RemoveProductCategoryService {
    async execute({ id }: IRemoveProductCategoryRequest) {
        try {
            // Verificar se relação existe
            const productCategory = await prismaClient.productCategory.findUnique({
                where: { id },
            });

            if (!productCategory) {
                throw new BadRequestException(
                    "Product-Category relation not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Deletar relação
            await prismaClient.productCategory.delete({
                where: { id }
            });

            return { message: "Category removed from product successfully" };
        } catch (error: any) {
            console.error("[RemoveProductCategoryService] Failed:", error);

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

export { RemoveProductCategoryService };
