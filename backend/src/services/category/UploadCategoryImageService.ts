import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { categoriesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadCategoryImage {
    category_id: string;
    filename: string;
}

class UploadCategoryImageService {
    async execute({ category_id, filename }: IUploadCategoryImage) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
        const category = await prismaClient.category.findFirst({
            where: { id: category_id },
        });

        if (!category) {
            const filePath = path.join(categoriesUploadDir, filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                "Category not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        let imageUrl: string;

        try {
            if (useR2) {
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(categoriesUploadDir, filename);

                imageUrl = await r2Service.uploadFromPath(localFilePath, 'categories');

                if (category.image && category.image.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: category.image });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (category.image && !category.image.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldImagePath = category.image.replace(`${backendUrl}/uploads/categories/`, '');
                    const oldFilePath = path.join(categoriesUploadDir, oldImagePath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                imageUrl = `${backendUrl}/uploads/categories/${filename}`;
            }

            const updatedCategory = await prismaClient.category.update({
                where: { id: category_id },
                data: { image: imageUrl },
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
            console.error("[UploadCategoryImageService] Failed:", error);

            const filePath = path.join(categoriesUploadDir, filename);
            
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

export { UploadCategoryImageService };
