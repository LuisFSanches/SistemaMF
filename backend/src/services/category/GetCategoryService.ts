import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetCategoryRequest {
    id: string
}

class GetCategoryService {
    async execute({ id }: IGetCategoryRequest) {
        try {
            const category = await prismaClient.category.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            });

            if (!category) {
                throw new BadRequestException(
                    "Category not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return category;
        } catch (error: any) {
            console.error("[GetCategoryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetCategoryService };
