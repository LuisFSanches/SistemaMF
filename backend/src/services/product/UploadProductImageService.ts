import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { productsUploadDir } from "../../config/paths";

interface IUploadProductImage {
    product_id: string;
    filename: string;
}

class UploadProductImageService {
    async execute({ product_id, filename }: IUploadProductImage) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        // console.log('[UploadProductImageService] Backend URL:', backendUrl);
        // console.log('[UploadProductImageService] Upload directory:', productsUploadDir);
        
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

        // console.log('[UploadProductImageService] Product found:', product.id);

        if (product.image) {
            const oldImagePath = product.image.replace(`${backendUrl}/uploads/products/`, '');
            const oldFilePath = path.join(productsUploadDir, oldImagePath);

            // console.log('[UploadProductImageService] Removing old image:', oldFilePath);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const imageUrl = `${backendUrl}/uploads/products/${filename}`;
        // console.log('[UploadProductImageService] New image URL:', imageUrl);

        try {
            const updatedProduct = await prismaClient.product.update({
                where: { id: product_id },
                data: { image: imageUrl },
            });

            //console.log('[UploadProductImageService] Product updated successfully');

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
