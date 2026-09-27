import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";
import { ResolveCampaignRecipientsService } from "./ResolveCampaignRecipientsService";
import { campaignQueue } from "../../queues/campaignQueue";

export class DispatchCampaignService {
    async execute(campaignId: string, store_id?: string) {
        try {
            const campaign = await prismaClient.campaign.findFirst({
                where: {
                    id: campaignId,
                    ...(store_id ? { store_id } : {}),
                },
            });

            if (!campaign) {
                throw new BadRequestException("Campaign not found", ErrorCodes.CAMPAIGN_NOT_FOUND);
            }

            if (campaign.status !== "DRAFT") {
                throw new BadRequestException(
                    "Campaign was already dispatched",
                    ErrorCodes.CAMPAIGN_ALREADY_DISPATCHED
                );
            }

            const resolveCampaignRecipientsService = new ResolveCampaignRecipientsService();
            const recipients = await resolveCampaignRecipientsService.execute(campaign.segment_id);

            if (recipients.length === 0) {
                const updated = await prismaClient.campaign.update({
                    where: { id: campaignId },
                    data: { status: "COMPLETED", total_recipients: 0, started_at: new Date(), completed_at: new Date() },
                });
                return updated;
            }

            await prismaClient.$transaction([
                prismaClient.campaignRecipient.createMany({
                    data: recipients.map((recipient) => ({
                        campaign_id: campaignId,
                        client_id: recipient.client_id,
                    })),
                }),
                prismaClient.campaign.update({
                    where: { id: campaignId },
                    data: {
                        status: "QUEUED",
                        total_recipients: recipients.length,
                        started_at: new Date(),
                    },
                }),
            ]);

            const createdRecipients = await prismaClient.campaignRecipient.findMany({
                where: { campaign_id: campaignId },
                select: { id: true },
            });

            await campaignQueue.addBulk(
                createdRecipients.map((recipient) => ({
                    name: "send-campaign-message",
                    data: { campaign_recipient_id: recipient.id },
                }))
            );

            const updated = await prismaClient.campaign.update({
                where: { id: campaignId },
                data: { status: "SENDING" },
            });

            return updated;
        } catch (error: any) {
            console.error("[DispatchCampaignService] Failed to dispatch campaign:", error);
            throw error;
        }
    }
}
