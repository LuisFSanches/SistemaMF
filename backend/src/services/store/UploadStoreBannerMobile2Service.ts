import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { storesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadStoreBannerMobile2 {
    store_id: string;
    filename: string;
}

class UploadStoreBannerMobile2Service {
    async execute({ store_id, filename }: IUploadStoreBannerMobile2) {
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

                if (store.banner_mobile_2 && store.banner_mobile_2.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: store.banner_mobile_2 });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (store.banner_mobile_2 && !store.banner_mobile_2.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldBannerPath = store.banner_mobile_2.replace(`${backendUrl}/uploads/stores/`, '');
                    const oldFilePath = path.join(storesUploadDir, oldBannerPath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                bannerUrl = `${backendUrl}/uploads/stores/${filename}`;
            }

            const updatedStore = await prismaClient.store.update({
                where: { id: store_id },
                data: { banner_mobile_2: bannerUrl },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    banner_mobile_2: true,
                    updated_at: true,
                },
            });

            return updatedStore;
        } catch (error: any) {
            console.error("[UploadStoreBannerMobile2Service] Failed:", error);

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

export { UploadStoreBannerMobile2Service };
