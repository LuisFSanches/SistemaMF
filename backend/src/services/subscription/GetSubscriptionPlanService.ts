import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetSubscriptionPlanService {
    async execute(planId: string) {
        // 1. Validar se o ID foi fornecido
        if (!planId) {
            throw new BadRequestException(
                "Plan ID is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 2. Buscar o plano de assinatura
            const subscriptionPlan = await prismaClient.subscriptionPlan.findFirst({
                where: { 
                    id: planId,
                    is_active: true 
                }
            });

            if (!subscriptionPlan) {
                throw new BadRequestException(
                    "Subscription plan not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }
            
            return subscriptionPlan;
        } catch (error: any) {
            console.error("[GetSubscriptionPlanService] Failed:", error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetSubscriptionPlanService };