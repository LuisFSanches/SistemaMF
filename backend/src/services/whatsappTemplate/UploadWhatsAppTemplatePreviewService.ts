import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import fs from 'fs';
import path from 'path';
import { whatsappTemplatesUploadDir } from "../../config/paths";
import { CloudflareR2Service } from "../storage/CloudflareR2Service";

interface IUploadWhatsAppTemplatePreview {
    template_id: string;
    filename: string;
}

class UploadWhatsAppTemplatePreviewService {
    async execute({ template_id, filename }: IUploadWhatsAppTemplatePreview) {
        const useR2 = process.env.USE_R2_STORAGE === 'true';

        const template = await prismaClient.whatsAppTemplate.findFirst({
            where: { id: template_id },
        });

        if (!template) {
            const filePath = path.join(whatsappTemplatesUploadDir, filename);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            throw new BadRequestException(
                "Template not found",
                ErrorCodes.TEMPLATE_NOT_FOUND
            );
        }

        let mediaUrl: string;

        try {
            if (useR2) {
                const r2Service = new CloudflareR2Service();
                const localFilePath = path.join(whatsappTemplatesUploadDir, filename);

                mediaUrl = await r2Service.uploadFromPath(localFilePath, 'whatsapp-templates');

                if (template.preview_image_url && template.preview_image_url.includes(process.env.R2_PUBLIC_URL || '')) {
                    await r2Service.delete({ fileUrl: template.preview_image_url });
                }

                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } else {
                const backendUrl = process.env.BACKEND_URL || 'http://localhost:3334';

                if (template.preview_image_url && !template.preview_image_url.includes(process.env.R2_PUBLIC_URL || '')) {
                    const oldMediaPath = template.preview_image_url.replace(`${backendUrl}/uploads/whatsapp-templates/`, '');
                    const oldFilePath = path.join(whatsappTemplatesUploadDir, oldMediaPath);

                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                mediaUrl = `${backendUrl}/uploads/whatsapp-templates/${filename}`;
            }

            const updatedTemplate = await prismaClient.whatsAppTemplate.update({
                where: { id: template_id },
                data: { preview_image_url: mediaUrl },
            });

            return updatedTemplate;
        } catch (error: any) {
            console.error("[UploadWhatsAppTemplatePreviewService] Failed:", error);

            const filePath = path.join(whatsappTemplatesUploadDir, filename);

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

export { UploadWhatsAppTemplatePreviewService };
