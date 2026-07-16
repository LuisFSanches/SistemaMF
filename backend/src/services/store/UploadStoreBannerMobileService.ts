import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { storesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadStoreBannerMobile {
    store_id: string;
    filename: string;
}

class UploadStoreBannerMobileService {
    async execute({ store_id, filename }: IUploadStoreBannerMobile) {
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

                if (store.banner_mobile && store.banner_mobile.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: store.banner_mobile });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (store.banner_mobile && !store.banner_mobile.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldBannerPath = store.banner_mobile.replace(`${backendUrl}/uploads/stores/`, '');
                    const oldFilePath = path.join(storesUploadDir, oldBannerPath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                bannerUrl = `${backendUrl}/uploads/stores/${filename}`;
            }

            const updatedStore = await prismaClient.store.update({
                where: { id: store_id },
                data: { banner_mobile: bannerUrl },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    banner_mobile: true,
                    updated_at: true,
                },
            });

            return updatedStore;
        } catch (error: any) {
            console.error("[UploadStoreBannerMobileService] Failed:", error);

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

export { UploadStoreBannerMobileService };
