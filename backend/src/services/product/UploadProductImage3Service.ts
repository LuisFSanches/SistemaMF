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

class UploadProductImage3Service {
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
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(productsUploadDir, filename);

                imageUrl = await r2Service.uploadFromPath(localFilePath, 'products');

                if (product.image_3 && product.image_3.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: product.image_3 });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {                
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (product.image_3 && !product.image_3.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldImagePath = product.image_3.replace(`${backendUrl}/uploads/products/`, '');
                    const oldFilePath = path.join(productsUploadDir, oldImagePath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                imageUrl = `${backendUrl}/uploads/products/${filename}`;
            }

            const updatedProduct = await prismaClient.product.update({
                where: { id: product_id },
                data: { image_3: imageUrl },
            });

            return updatedProduct;
        } catch (error: any) {
            console.error("[UploadProductImage3Service] Failed:", error);

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

export { UploadProductImage3Service };
