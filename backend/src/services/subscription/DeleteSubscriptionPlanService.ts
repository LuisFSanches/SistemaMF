import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteSubscriptionPlanService {
    async execute(planId: string) {
        // 1. Validar se o ID foi fornecido
        if (!planId) {
            throw new BadRequestException(
                "Plan ID is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 2. Verificar se o plano existe
            const existingPlan = await prismaClient.subscriptionPlan.findUnique({
                where: { id: planId }
            });

            if (!existingPlan) {
                throw new BadRequestException(
                    "Subscription plan not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 3. Verificar se existe alguma assinatura ativa usando este plano
            const activeSubscriptions = await prismaClient.subscription.findMany({
                where: {
                    subscription_plan_id: planId,
                    status: { in: ['PENDING', 'ACTIVE'] }
                }
            });

            if (activeSubscriptions.length > 0) {
                throw new BadRequestException(
                    "Cannot delete subscription plan with active subscriptions",
                    ErrorCodes.BAD_REQUEST
                );
            }

            // 4. Desativar o plano (soft delete)
            const deletedPlan = await prismaClient.subscriptionPlan.update({
                where: { id: planId },
                data: { is_active: false }
            });
            
            return deletedPlan;
        } catch (error: any) {
            console.error("[DeleteSubscriptionPlanService] Failed:", error);

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

export { DeleteSubscriptionPlanService };