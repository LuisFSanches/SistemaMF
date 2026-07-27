import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { models3dUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface ICreateOrReplaceProduct3DModel {
    product_id: string;
    filename: string;
    originalname: string;
    size: number;
    mode: 'create' | 'replace';
}

class CreateOrReplaceProduct3DModelService {
    async execute({ product_id, filename, originalname, size, mode }: ICreateOrReplaceProduct3DModel) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';
        const localFilePath = path.join(models3dUploadDir, filename);

        const product = await prismaClient.product.findFirst({
            where: { id: product_id },
        });

        if (!product) {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }

            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        const existingModel = await prismaClient.product3DModel.findUnique({
            where: { product_id },
        });

        if (mode === 'create' && existingModel) {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }

            throw new BadRequestException(
                "Product already has a 3D model. Use replace instead",
                ErrorCodes.PRODUCT_3D_MODEL_ALREADY_EXISTS
            );
        }

        try {
            let modelUrl: string;

            if (useR2) {
                const r2Service = new CloudflareR2Service();

                modelUrl = await r2Service.uploadFromPath(localFilePath, 'models3d');

                if (existingModel && existingModel.model_url.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: existingModel.model_url });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (existingModel && !existingModel.model_url.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldFilename = existingModel.model_url.replace(`${backendUrl}/uploads/models3d/`, '');
                    const oldFilePath = path.join(models3dUploadDir, oldFilename);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                modelUrl = `${backendUrl}/uploads/models3d/${filename}`;
            }

            const model = await prismaClient.product3DModel.upsert({
                where: { product_id },
                create: {
                    product_id,
                    model_url: modelUrl,
                    original_filename: originalname,
                    file_size: size,
                },
                update: {
                    model_url: modelUrl,
                    original_filename: originalname,
                    file_size: size,
                },
            });

            return model;
        } catch (error: any) {
            console.error("[CreateOrReplaceProduct3DModelService] Failed:", error);

            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateOrReplaceProduct3DModelService };
