import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllSubscriptionPlansService {
    async execute() {
        try {
            console.log("[GetAllSubscriptionPlansService] Fetching all active subscription plans...");
            const subscriptionPlans = await prismaClient.subscriptionPlan.findMany({
                where: { is_active: true },
                orderBy: { created_at: 'asc' }
            });

            console.log("[GetAllSubscriptionPlansService] Retrieved plans:", subscriptionPlans.length);
            
            return subscriptionPlans;
        } catch (error: any) {
            console.error("[GetAllSubscriptionPlansService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllSubscriptionPlansService };