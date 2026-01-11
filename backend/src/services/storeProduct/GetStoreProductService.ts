import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetStoreProductRequest {
    id: string;
}

class GetStoreProductService {
    async execute({ id }: IGetStoreProductRequest) {
        try {
            const storeProduct = await prismaClient.storeProduct.findUnique({
                where: { id },
                include: {
                    product: {
                        include: {
                            categories: true,
                        },
                    },
                    store: true,
                },
            });

            if (!storeProduct) {
                throw new BadRequestException(
                    "Store product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return storeProduct;
        } catch (error: any) {
            console.error("[GetStoreProductService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStoreProductService };
