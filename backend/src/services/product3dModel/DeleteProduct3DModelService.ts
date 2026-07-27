import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { models3dUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

class DeleteProduct3DModelService {
    async execute(product_id: string) {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';
        const useR2 = process.env.USE_R2_STORAGE === 'true';

        const model = await prismaClient.product3DModel.findUnique({
            where: { product_id },
        });

        if (!model) {
            throw new BadRequestException(
                "Product has no 3D model to delete",
                ErrorCodes.PRODUCT_3D_MODEL_NOT_FOUND
            );
        }

        try {
            if (useR2 && model.model_url.includes(process.env.R2_PUBLIC_URL || '')) {
                const r2Service = new CloudflareR2Service();
                await r2Service.delete({ fileUrl: model.model_url });
            } else {
                const filename = model.model_url.replace(`${backendUrl}/uploads/models3d/`, '');
                const filePath = path.join(models3dUploadDir, filename);

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await prismaClient.product3DModel.delete({
                where: { product_id },
            });

            return { success: true };
        } catch (error: any) {
            console.error("[DeleteProduct3DModelService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteProduct3DModelService };
