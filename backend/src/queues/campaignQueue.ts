import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection";

export interface ICampaignDispatchJob {
    campaign_recipient_id: string;
}

const CAMPAIGN_QUEUE_NAME = "campaign-dispatch";

const rateLimitPerSecond = Number(process.env.WHATSAPP_RATE_LIMIT_PER_SECOND) || 10;

const campaignQueue = new Queue<ICampaignDispatchJob>(CAMPAIGN_QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
    },
});

export { campaignQueue, CAMPAIGN_QUEUE_NAME, rateLimitPerSecond };
