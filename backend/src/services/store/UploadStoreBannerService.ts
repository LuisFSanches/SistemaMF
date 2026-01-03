import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';

interface IUploadStoreBanner {
    store_id: string;
    filename: string;
}

class UploadStoreBannerService {
    async execute({ store_id, filename }: IUploadStoreBanner) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        const storesUploadDir = path.join(__dirname, '../../../uploads/stores');
        
        const store = await prismaClient.store.findFirst({
            where: { id: store_id },
        });

        if (!store) {
            const filePath = path.join(storesUploadDir, filename);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Remover banner anterior se existir
        if (store.banner) {
            const oldBannerPath = store.banner.replace(`${backendUrl}/uploads/stores/`, '');
            const oldFilePath = path.join(storesUploadDir, oldBannerPath);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const bannerUrl = `${backendUrl}/uploads/stores/${filename}`;

        try {
            const updatedStore = await prismaClient.store.update({
                where: { id: store_id },
                data: { banner: bannerUrl },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    banner: true,
                    updated_at: true,
                },
            });

            return updatedStore;
        } catch (error: any) {
            console.error("[UploadStoreBannerService] Failed:", error);

            const filePath = path.join(storesUploadDir, filename);
            
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

export { UploadStoreBannerService };
