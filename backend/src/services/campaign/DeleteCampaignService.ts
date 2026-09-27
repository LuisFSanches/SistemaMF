import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class DeleteCampaignService {
    async execute(campaignId: string, store_id?: string) {
        try {
            const existingCampaign = await prismaClient.campaign.findFirst({
                where: {
                    id: campaignId,
                    ...(store_id ? { store_id } : {}),
                },
            });

            if (!existingCampaign) {
                throw new BadRequestException("Campaign not found", ErrorCodes.CAMPAIGN_NOT_FOUND);
            }

            if (existingCampaign.status !== "DRAFT") {
                throw new BadRequestException(
                    "Only draft campaigns can be deleted",
                    ErrorCodes.CAMPAIGN_ALREADY_DISPATCHED
                );
            }

            await prismaClient.campaign.delete({
                where: { id: campaignId },
            });

            return { success: true };
        } catch (error: any) {
            console.error("[DeleteCampaignService] Failed to delete campaign:", error);
            throw error;
        }
    }
}
