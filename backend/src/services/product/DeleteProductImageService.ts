import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { productsUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IDeleteProductImage {
    product_id: string;
    image_field?: 'image' | 'image_2' | 'image_3';
}

class DeleteProductImageService {
    async execute({ product_id, image_field = 'image' }: IDeleteProductImage) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
        const product = await prismaClient.product.findFirst({
            where: { id: product_id },
        });

        if (!product) {
            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        const imageUrl = product[image_field];

        if (!imageUrl) {
            throw new BadRequestException(
                `Product has no ${image_field} to delete`,
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
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

            const updatedProduct = await prismaClient.product.update({
                where: { id: product_id },
                data: { [image_field]: null },
            });

            return updatedProduct;
        } catch (error: any) {
            console.error("[DeleteProductImageService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteProductImageService };
