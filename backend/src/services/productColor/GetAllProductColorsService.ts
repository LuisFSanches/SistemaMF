import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllProductColorsService {
    async execute() {
        try {
            const colors = await prismaClient.productColor.findMany({
                orderBy: [
                    { sort_order: 'asc' },
                    { name: 'asc' }
                ],
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            });

            return colors;
        } catch (error: any) {
            console.error("[GetAllProductColorsService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllProductColorsService };
