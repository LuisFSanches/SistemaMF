import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';

interface IDeleteStore {
    id: string;
}

class DeleteStoreService {
    async execute({ id }: IDeleteStore) {
        // Verificar se store existe
        const existingStore = await prismaClient.store.findFirst({
            where: { id },
        });

        if (!existingStore) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            // Remover imagens se existirem
            const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
            
            if (existingStore.logo) {
                const logoPath = existingStore.logo.replace(`${backendUrl}/uploads/stores/`, '');
                const logoFilePath = path.join(__dirname, '../../../uploads/stores', logoPath);
                
                if (fs.existsSync(logoFilePath)) {
                    fs.unlinkSync(logoFilePath);
                }
            }

            if (existingStore.banner) {
                const bannerPath = existingStore.banner.replace(`${backendUrl}/uploads/stores/`, '');
                const bannerFilePath = path.join(__dirname, '../../../uploads/stores', bannerPath);
                
                if (fs.existsSync(bannerFilePath)) {
                    fs.unlinkSync(bannerFilePath);
                }
            }

            // Deletar store
            await prismaClient.store.delete({
                where: { id },
            });

            return { message: "Store deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStoreService };
