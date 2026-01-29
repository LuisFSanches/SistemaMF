import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { categoriesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IDeleteCategoryImage {
    category_id: string;
}

class DeleteCategoryImageService {
    async execute({ category_id }: IDeleteCategoryImage) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
        const category = await prismaClient.category.findFirst({
            where: { id: category_id },
        });

        if (!category) {
            throw new BadRequestException(
                "Category not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        if (!category.image) {
            throw new BadRequestException(
                "Category has no image",
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            if (useR2) {
                const r2Service = new CloudflareR2Service();
                await r2Service.delete({ fileUrl: category.image });
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
                const imagePath = category.image.replace(`${backendUrl}/uploads/categories/`, '');
                const filePath = path.join(categoriesUploadDir, imagePath);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            const updatedCategory = await prismaClient.category.update({
                where: { id: category_id },
                data: { image: null },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image: true,
                    updated_at: true,
                },
            });

            return updatedCategory;
        } catch (error: any) {
            console.error("[DeleteCategoryImageService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteCategoryImageService };
