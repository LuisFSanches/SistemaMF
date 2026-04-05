import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { productsUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IDeleteStoreProductImage {
    store_product_id: string;
    image_field?: 'image' | 'image_2' | 'image_3';
}

class DeleteStoreProductImageService {
    async execute({ store_product_id, image_field = 'image' }: IDeleteStoreProductImage) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
        // Buscar store_product com produto pai relacionado
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

        const imageUrl = storeProduct[image_field];

        if (!imageUrl) {
            throw new BadRequestException(
                `Store product has no ${image_field} to delete`,
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            // Verificar se o produto pai está usando a mesma imagem
            const parentImageUrl = storeProduct.product[image_field];
            const parentIsUsingThisImage = parentImageUrl === imageUrl;

            // Só deletar o arquivo físico se o produto pai NÃO estiver usando
            if (!parentIsUsingThisImage) {
                if (useR2 && imageUrl.includes(process.env.R2_PUBLIC_URL || '')) {
                    const r2Service = new CloudflareR2Service();
                    await r2Service.delete({ fileUrl: imageUrl });
                } else {
                    const imagePath = imageUrl.replace(`${backendUrl}/uploads/products/`, '');
                    const filePath = path.join(productsUploadDir, imagePath);

                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } else {
                console.log(`[DeleteStoreProductImageService] Skipping file deletion: parent product is using ${image_field}`);
            }

            // Sempre remover a referência do store_product
            const updatedStoreProduct = await prismaClient.storeProduct.update({
                where: { id: store_product_id },
                data: { [image_field]: null },
            });

            return updatedStoreProduct;
        } catch (error: any) {
            console.error("[DeleteStoreProductImageService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStoreProductImageService };
