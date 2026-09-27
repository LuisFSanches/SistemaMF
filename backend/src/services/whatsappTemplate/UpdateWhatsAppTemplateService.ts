import prismaClient from "../../prisma";
import { updateWhatsAppTemplateSchema } from "../../schemas/whatsappTemplate/updateWhatsAppTemplateSchema";
import { WhatsAppTemplateVariableType } from "../../schemas/whatsappTemplate/whatsappTemplateVariableTypes";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IUpdateWhatsAppTemplateData {
    name?: string;
    language_code?: string;
    variable_types?: WhatsAppTemplateVariableType[];
    header_type?: "NONE" | "IMAGE" | "VIDEO" | "DOCUMENT";
    header_media_url?: string | null;
}

export class UpdateWhatsAppTemplateService {
    async execute(templateId: string, data: IUpdateWhatsAppTemplateData) {
        try {
            const validatedData = updateWhatsAppTemplateSchema.parse(data);

            const existingTemplate = await prismaClient.whatsAppTemplate.findUnique({
                where: { id: templateId },
            });

            if (!existingTemplate) {
                throw new BadRequestException(
                    "Template not found",
                    ErrorCodes.TEMPLATE_NOT_FOUND
                );
            }

            const template = await prismaClient.whatsAppTemplate.update({
                where: { id: templateId },
                data: {
                    name: validatedData.name,
                    language_code: validatedData.language_code,
                    variable_count: validatedData.variable_count,
                    variable_types: validatedData.variable_types,
                    header_type: validatedData.header_type,
                    header_media_url: validatedData.header_type === "NONE" ? null : validatedData.header_media_url,
                },
            });

            return template;
        } catch (error: any) {
            console.error("[UpdateWhatsAppTemplateService] Failed to update template:", error);
            throw error;
        }
    }
}
