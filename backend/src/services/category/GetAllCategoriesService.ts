import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllCategoriesService {
    async execute() {
        try {
            const categories = await prismaClient.category.findMany({
                orderBy: {
                    name: 'asc'
                },
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            });

            return categories;
        } catch (error: any) {
            console.error("[GetAllCategoriesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllCategoriesService };
