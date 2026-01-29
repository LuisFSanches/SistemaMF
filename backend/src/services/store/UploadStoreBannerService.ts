import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { storesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadStoreBanner {
    store_id: string;
    filename: string;
}

class UploadStoreBannerService {
    async execute({ store_id, filename }: IUploadStoreBanner) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        
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

        let bannerUrl: string;

        try {
            if (useR2) {
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(storesUploadDir, filename);

                bannerUrl = await r2Service.uploadFromPath(localFilePath, 'stores');

                if (store.banner && store.banner.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: store.banner });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (store.banner && !store.banner.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldBannerPath = store.banner.replace(`${backendUrl}/uploads/stores/`, '');
                    const oldFilePath = path.join(storesUploadDir, oldBannerPath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                bannerUrl = `${backendUrl}/uploads/stores/${filename}`;
            }

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
