import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class GetCampaignDetailsService {
    async execute(campaignId: string, store_id?: string) {
        try {
            const campaign = await prismaClient.campaign.findFirst({
                where: {
                    id: campaignId,
                    ...(store_id ? { store_id } : {}),
                },
                include: {
                    segment: { select: { id: true, name: true, type: true } },
                    template: true,
                    coupon: { select: { id: true, code: true } },
                    recipients: {
                        include: {
                            client: {
                                select: { id: true, first_name: true, last_name: true, phone_number: true },
                            },
                        },
                    },
                },
            });

            if (!campaign) {
                throw new BadRequestException("Campaign not found", ErrorCodes.CAMPAIGN_NOT_FOUND);
            }

            return campaign;
        } catch (error: any) {
            console.error("[GetCampaignDetailsService] Failed to get campaign details:", error);
            throw error;
        }
    }
}
