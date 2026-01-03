import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';

interface IUploadStoreLogo {
    store_id: string;
    filename: string;
}

class UploadStoreLogoService {
    async execute({ store_id, filename }: IUploadStoreLogo) {
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

        // Remover logo anterior se existir
        if (store.logo) {
            const oldLogoPath = store.logo.replace(`${backendUrl}/uploads/stores/`, '');
            const oldFilePath = path.join(storesUploadDir, oldLogoPath);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        const logoUrl = `${backendUrl}/uploads/stores/${filename}`;

        try {
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
