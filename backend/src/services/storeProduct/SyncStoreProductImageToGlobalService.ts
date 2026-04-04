import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface ISyncStoreProductImageToGlobal {
    store_product_id: string;
    image_field: 'image' | 'image_2' | 'image_3';
}

class SyncStoreProductImageToGlobalService {
    async execute({ store_product_id, image_field }: ISyncStoreProductImageToGlobal) {
        try {
            // Buscar o store_product com o produto relacionado
            const storeProduct = await prismaClient.storeProduct.findFirst({
                where: { id: store_product_id },
                include: { product: true },
            });

            if (!storeProduct) {
                throw new BadRequestException(
                    "Store product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Verificar se o store_product tem a imagem solicitada
            const storeProductImageUrl = storeProduct[image_field];

            if (!storeProductImageUrl) {
                throw new BadRequestException(
                    `Store product has no ${image_field} to sync`,
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Verificar se o produto pai já tem imagem naquele campo
            const parentProductImageUrl = storeProduct.product[image_field];

            if (parentProductImageUrl) {
                throw new BadRequestException(
                    `Parent product already has ${image_field}. Cannot sync.`,
                    ErrorCodes.BAD_REQUEST
                );
            }

            // Copiar a imagem do store_product para o produto pai
            const updatedParentProduct = await prismaClient.product.update({
                where: { id: storeProduct.product_id },
                data: { [image_field]: storeProductImageUrl },
            });

            return {
                success: true,
                message: `${image_field} synced to global catalog successfully`,
                parent_product: updatedParentProduct,
            };
        } catch (error: any) {
            console.error("[SyncStoreProductImageToGlobalService] Failed:", error);

            // Re-throw BadRequestException as-is
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

export { SyncStoreProductImageToGlobalService };
