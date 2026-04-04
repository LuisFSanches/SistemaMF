import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { productsUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadStoreProductImage {
    store_product_id: string;
    filename: string;
}

class UploadStoreProductImage3Service {
    async execute({ store_product_id, filename }: IUploadStoreProductImage) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
        const storeProduct = await prismaClient.storeProduct.findFirst({
            where: { id: store_product_id },
        });

        if (!storeProduct) {
            const filePath = path.join(productsUploadDir, filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                "Store product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        let imageUrl: string;

        try {
            if (useR2) {                
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(productsUploadDir, filename);

                imageUrl = await r2Service.uploadFromPath(localFilePath, 'products');

                if (storeProduct.image_3 && storeProduct.image_3.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: storeProduct.image_3 });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {                
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (storeProduct.image_3 && !storeProduct.image_3.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldImagePath = storeProduct.image_3.replace(`${backendUrl}/uploads/products/`, '');
                    const oldFilePath = path.join(productsUploadDir, oldImagePath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                imageUrl = `${backendUrl}/uploads/products/${filename}`;
            }

            const updatedStoreProduct = await prismaClient.storeProduct.update({
                where: { id: store_product_id },
                data: { image_3: imageUrl },
            });

            return updatedStoreProduct;
        } catch (error: any) {
            console.error("[UploadStoreProductImage3Service] Failed:", error);

            const filePath = path.join(productsUploadDir, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UploadStoreProductImage3Service };
