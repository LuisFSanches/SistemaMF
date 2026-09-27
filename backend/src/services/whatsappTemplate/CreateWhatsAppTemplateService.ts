import prismaClient from "../../prisma";
import { createWhatsAppTemplateSchema } from "../../schemas/whatsappTemplate/createWhatsAppTemplateSchema";
import { WhatsAppTemplateVariableType } from "../../schemas/whatsappTemplate/whatsappTemplateVariableTypes";

interface ICreateWhatsAppTemplateData {
    name: string;
    language_code?: string;
    variable_types: WhatsAppTemplateVariableType[];
    header_type?: "NONE" | "IMAGE" | "VIDEO" | "DOCUMENT";
    header_media_url?: string | null;
}

export class CreateWhatsAppTemplateService {
    async execute(data: ICreateWhatsAppTemplateData) {
        try {
            const validatedData = createWhatsAppTemplateSchema.parse(data);

            const template = await prismaClient.whatsAppTemplate.create({
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
            console.error("[CreateWhatsAppTemplateService] Failed to create template:", error);
            throw error;
        }
    }
}
