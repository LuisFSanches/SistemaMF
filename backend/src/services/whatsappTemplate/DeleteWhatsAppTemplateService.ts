import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class DeleteWhatsAppTemplateService {
    async execute(templateId: string) {
        try {
            const existingTemplate = await prismaClient.whatsAppTemplate.findUnique({
                where: { id: templateId },
            });

            if (!existingTemplate) {
                throw new BadRequestException(
                    "Template not found",
                    ErrorCodes.TEMPLATE_NOT_FOUND
                );
            }

            const dependentCampaigns = await prismaClient.campaign.findMany({
                where: { template_id: templateId },
                select: { id: true, name: true },
            });

            if (dependentCampaigns.length > 0) {
                const campaignNames = dependentCampaigns.map((c) => c.name).join(", ");
                throw new BadRequestException(
                    `Cannot delete template: it is used by the following campaigns: ${campaignNames}`,
                    ErrorCodes.TEMPLATE_IN_USE
                );
            }

            await prismaClient.whatsAppTemplate.delete({
                where: { id: templateId },
            });

            return { success: true };
        } catch (error: any) {
            console.error("[DeleteWhatsAppTemplateService] Failed to delete template:", error);
            throw error;
        }
    }
}
