import { Worker, Job } from "bullmq";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";
import prismaClient from "../prisma";
import { redisConnection } from "../queues/redisConnection";
import { CAMPAIGN_QUEUE_NAME, rateLimitPerSecond, ICampaignDispatchJob } from "../queues/campaignQueue";
import { SendWhatsAppTemplateService } from "../services/whatsapp/SendWhatsAppTemplateService";
import { WhatsAppTemplateVariableType } from "../schemas/whatsappTemplate/whatsappTemplateVariableTypes";
import { formatDiscountValue, formatMonetaryValue } from "../services/campaign/utils/formatCouponValue";

function formatPhoneWithCountryCode(phone_number: string, country_code: string): string {
    const cleanPhone = phone_number.replace(/\D/g, "");
    const callingCode = getCountryCallingCode((country_code || "BR") as CountryCode);
    return cleanPhone.startsWith(callingCode) ? cleanPhone : `${callingCode}${cleanPhone}`;
}

async function processCampaignDispatchJob(job: Job<ICampaignDispatchJob>) {
    const { campaign_recipient_id } = job.data;

    const recipient = await prismaClient.campaignRecipient.findUnique({
        where: { id: campaign_recipient_id },
        include: {
            client: true,
            campaign: {
                include: {
                    template: true,
                    coupon: true,
                },
            },
        },
    });

    if (!recipient) {
        console.error(`[campaignWorker] CampaignRecipient ${campaign_recipient_id} not found`);
        return;
    }

    if (recipient.status !== "PENDING") {
        // Already processed (e.g. retried after a partial failure) — skip to stay idempotent.
        return;
    }

    const { campaign, client } = recipient;
    const variableTypes = campaign.template.variable_types as WhatsAppTemplateVariableType[];
    const variableValues = campaign.variable_values as (string | null)[];

    let storeName: string | null = null;
    if (variableTypes.includes("STORE_NAME")) {
        const latestOrder = await prismaClient.order.findFirst({
            where: {
                client_id: client.id,
                ...(campaign.store_id ? { store_id: campaign.store_id } : {}),
            },
            orderBy: { delivery_date: "desc" },
            select: { store: { select: { name: true } } },
        });
        storeName = latestOrder?.store?.name ?? null;

        // Fallback: cliente sem pedido (ou sem pedido na loja da campanha) ainda
        // deve poder receber a campanha — usa a loja da própria campanha, já que
        // um parâmetro de template vazio é rejeitado pela API da Meta.
        if (!storeName && campaign.store_id) {
            const campaignStore = await prismaClient.store.findUnique({
                where: { id: campaign.store_id },
                select: { name: true },
            });
            storeName = campaignStore?.name ?? null;
        }
    }

    const parameters = variableTypes.map((type, index) => {
        if (type === "STORE_NAME") return storeName ?? "";
        if (type === "COUPON_CODE") return campaign.coupon?.code ?? "";
        if (type === "COUPON_DISCOUNT_VALUE") {
            return campaign.coupon
                ? formatDiscountValue(campaign.coupon.discount_type, Number(campaign.coupon.discount_value))
                : "";
        }
        if (type === "COUPON_MAX_DISCOUNT") {
            return campaign.coupon?.max_discount_amount != null
                ? formatMonetaryValue(Number(campaign.coupon.max_discount_amount))
                : "";
        }
        if (type === "COUPON_MIN_ORDER_AMOUNT") {
            return campaign.coupon?.minimum_order_amount != null
                ? formatMonetaryValue(Number(campaign.coupon.minimum_order_amount))
                : "";
        }
        return variableValues[index] ?? "";
    });

    const phone_number = formatPhoneWithCountryCode(client.phone_number, client.country_code);

    const sendWhatsAppTemplateService = new SendWhatsAppTemplateService();
    const result = await sendWhatsAppTemplateService.execute({
        phone_number,
        template_name: campaign.template.name,
        language_code: campaign.template.language_code,
        parameters,
        header_type: campaign.template.header_type,
        header_media_url: campaign.template.header_media_url,
    });

    if (result.success) {
        await prismaClient.$transaction([
            prismaClient.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "SENT", message_id: result.message_id, sent_at: new Date() },
            }),
            prismaClient.campaign.update({
                where: { id: campaign.id },
                data: { sent_count: { increment: 1 } },
            }),
            prismaClient.client.update({
                where: { id: client.id },
                data: {
                    last_campaign_received: campaign.name,
                    last_campaign_date: new Date(),
                    total_campaigns_received: { increment: 1 },
                },
            }),
        ]);
    } else {
        await prismaClient.$transaction([
            prismaClient.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "FAILED", error_message: result.error },
            }),
            prismaClient.campaign.update({
                where: { id: campaign.id },
                data: { failed_count: { increment: 1 } },
            }),
        ]);
    }

    const pendingCount = await prismaClient.campaignRecipient.count({
        where: { campaign_id: campaign.id, status: "PENDING" },
    });

    if (pendingCount === 0) {
        await prismaClient.campaign.update({
            where: { id: campaign.id },
            data: { status: "COMPLETED", completed_at: new Date() },
        });
    }
}

const campaignWorker = new Worker<ICampaignDispatchJob>(
    CAMPAIGN_QUEUE_NAME,
    processCampaignDispatchJob,
    {
        connection: redisConnection,
        limiter: { max: rateLimitPerSecond, duration: 1000 },
    }
);

campaignWorker.on("failed", (job, error) => {
    console.error(`[campaignWorker] Job ${job?.id} failed:`, error);
});

export { campaignWorker };
