import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IDeleteStoreProductRequest {
    id: string;
}

class DeleteStoreProductService {
    async execute({ id }: IDeleteStoreProductRequest) {
        // Verificar se o produto da loja existe
        const storeProductExists = await prismaClient.storeProduct.findUnique({
            where: { id },
        });

        if (!storeProductExists) {
            throw new BadRequestException(
                "Store product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Deletar o produto da loja
        try {
            await prismaClient.storeProduct.delete({
                where: { id },
            });

            return { message: "Store product deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreProductService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStoreProductService };
