import prismaClient from "../../prisma";
import { ErrorCodes, HttpException } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";

interface IDeleteProductColorRequest {
    id: string
}

class DeleteProductColorService {
    async execute({ id }: IDeleteProductColorRequest) {
        try {
            const existingColor = await prismaClient.productColor.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: { products: true }
                    }
                }
            });

            if (!existingColor) {
                throw new NotFoundException(
                    "Color not found",
                    ErrorCodes.PRODUCT_COLOR_NOT_FOUND
                );
            }

            if (existingColor._count.products > 0) {
                throw new BadRequestException(
                    `Cannot delete color used by ${existingColor._count.products} products`,
                    ErrorCodes.PRODUCT_COLOR_IN_USE
                );
            }

            await prismaClient.productColor.delete({
                where: { id }
            });

            return { message: "Color deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteProductColorService] Failed:", error);

            if (error instanceof HttpException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteProductColorService };
