import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { storesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadStoreLogo {
    store_id: string;
    filename: string;
}

class UploadStoreLogoService {
    async execute({ store_id, filename }: IUploadStoreLogo) {
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

        let logoUrl: string;

        try {
            if (useR2) {
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(storesUploadDir, filename);

                logoUrl = await r2Service.uploadFromPath(localFilePath, 'stores');

                if (store.logo && store.logo.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: store.logo });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (store.logo && !store.logo.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldLogoPath = store.logo.replace(`${backendUrl}/uploads/stores/`, '');
                    const oldFilePath = path.join(storesUploadDir, oldLogoPath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                logoUrl = `${backendUrl}/uploads/stores/${filename}`;
            }

            const updatedStore = await prismaClient.store.update({
                where: { id: store_id },
                data: { logo: logoUrl },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true,
                    updated_at: true,
                },
            });

            return updatedStore;
        } catch (error: any) {
            console.error("[UploadStoreLogoService] Failed:", error);

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

export { UploadStoreLogoService };
