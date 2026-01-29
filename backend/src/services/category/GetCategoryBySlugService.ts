import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetCategoryBySlugRequest {
    slug: string
}

class GetCategoryBySlugService {
    async execute({ slug }: IGetCategoryBySlugRequest) {
        try {
            const category = await prismaClient.category.findUnique({
                where: { slug },
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
            console.error("[GetCategoryBySlugService] Failed:", error);

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

export { GetCategoryBySlugService };
