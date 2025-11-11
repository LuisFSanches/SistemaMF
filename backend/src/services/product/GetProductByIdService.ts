import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetProductById {
    id: string;
}

class GetProductByIdService {
    async execute({ id }: IGetProductById) {
        try {
            const product = await prismaClient.product.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    unity: true,
                    stock: true,
                    enabled: true,
                    image: true,
                    qr_code: true,
                    created_at: true,
                    updated_at: true
                }
            });

            if (!product) {
                throw new BadRequestException(
                    "Product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return product;
        } catch (error: any) {
            console.error("[GetProductByIdService] Failed:", error);

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

export { GetProductByIdService };
