import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';

interface IUploadProductImage {
    product_id: string;
    filename: string;
}

class UploadProductImageService {
    async execute({ product_id, filename }: IUploadProductImage) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        
        const product = await prismaClient.product.findFirst({
            where: { id: product_id },
        });

        if (!product) {
            const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'products');
            const filePath = path.join(uploadDir, filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        if (product.image) {
            const oldImagePath = product.image.replace(`${backendUrl}/uploads/products/`, '');
            const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'products');
            const oldFilePath = path.join(uploadDir, oldImagePath);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const imageUrl = `${backendUrl}/uploads/products/${filename}`;

        try {
            const updatedProduct = await prismaClient.product.update({
                where: { id: product_id },
                data: { image: imageUrl },
            });

            return updatedProduct;
        } catch (error: any) {
            console.error("[UploadProductImageService] Failed:", error);

            const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'products');
            const filePath = path.join(uploadDir, filename);
            
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
