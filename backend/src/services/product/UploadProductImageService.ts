import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { productsUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadProductImage {
    product_id: string;
    filename: string;
}

class UploadProductImageService {
    async execute({ product_id, filename }: IUploadProductImage) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
        const product = await prismaClient.product.findFirst({
            where: { id: product_id },
        });

        if (!product) {
            const filePath = path.join(productsUploadDir, filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        let imageUrl: string;

        try {
            if (useR2) {
                console.log('[UploadProductImageService] Using R2 storage');
                
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(productsUploadDir, filename);

                imageUrl = await r2Service.uploadFromPath(localFilePath, 'products');

                if (product.image && product.image.includes(process.env.R2_PUBLIC_URL || '')) {
                    console.log('[UploadProductImageService] Deleting old image from R2');
                    await r2Service.delete({ fileUrl: product.image });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                    console.log('[UploadProductImageService] Local file deleted after R2 upload');
                }
            } else {
                console.log('[UploadProductImageService] Using local storage');
                
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (product.image && !product.image.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldImagePath = product.image.replace(`${backendUrl}/uploads/products/`, '');
                    const oldFilePath = path.join(productsUploadDir, oldImagePath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                        console.log('[UploadProductImageService] Old local file deleted');
                    }
                }

                imageUrl = `${backendUrl}/uploads/products/${filename}`;
            }

            const updatedProduct = await prismaClient.product.update({
                where: { id: product_id },
                data: { image: imageUrl },
            });

            return updatedProduct;
        } catch (error: any) {
            console.error("[UploadProductImageService] Failed:", error);

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

export { UploadProductImageService };
