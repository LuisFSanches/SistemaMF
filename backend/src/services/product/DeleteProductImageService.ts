import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';

interface IDeleteProductImage {
    product_id: string;
}

class DeleteProductImageService {
    async execute({ product_id }: IDeleteProductImage) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        
        const product = await prismaClient.product.findFirst({
            where: { id: product_id },
        });

        if (!product) {
            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        if (!product.image) {
            throw new BadRequestException(
                "Product has no image to delete",
                ErrorCodes.BAD_REQUEST
            );
        }

        const imagePath = product.image.replace(`${backendUrl}/uploads/products/`, '');
        const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads', 'products');
        const filePath = path.join(uploadDir, imagePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        try {
            const updatedProduct = await prismaClient.product.update({
                where: { id: product_id },
                data: { image: null },
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
