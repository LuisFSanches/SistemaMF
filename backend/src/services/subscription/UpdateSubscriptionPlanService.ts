import { IUpdateSubscriptionPlan } from "../../interfaces/ISubscriptionPlan";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateSubscriptionPlanSchema } from "../../schemas/subscription/subscriptionPlan";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateSubscriptionPlanService {
    async execute(planId: string, data: IUpdateSubscriptionPlan) {
        // 1. Validar se o ID foi fornecido
        if (!planId) {
            throw new BadRequestException(
                "Plan ID is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Validação com Zod
        const parsed = updateSubscriptionPlanSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 3. Verificar se o plano existe
            const existingPlan = await prismaClient.subscriptionPlan.findUnique({
                where: { id: planId }
            });

            if (!existingPlan) {
                throw new BadRequestException(
                    "Subscription plan not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 4. Verificar se já existe outro plano com mesmo nome e billing_cycle (se fornecidos)
            if (data.name && data.billing_cycle) {
                const conflictingPlan = await prismaClient.subscriptionPlan.findFirst({
                    where: { 
                        name: data.name,
                        billing_cycle: data.billing_cycle,
                        id: { not: planId }
                    }
                });

                if (conflictingPlan) {
                    throw new BadRequestException(
                        "Another subscription plan with this name and billing cycle already exists",
                        ErrorCodes.USER_ALREADY_EXISTS
                    );
                }
            }

            // 5. Atualizar o plano de assinatura
            const updatedPlan = await prismaClient.subscriptionPlan.update({
                where: { id: planId },
                data: {
                    ...(data.name && { name: data.name }),
                    ...(data.description !== undefined && { description: data.description }),
                    ...(data.price && { price: data.price }),
                    ...(data.billing_cycle && { billing_cycle: data.billing_cycle }),
                    ...(data.mp_plan_id !== undefined && { mp_plan_id: data.mp_plan_id }),
                    ...(data.is_active !== undefined && { is_active: data.is_active })
                }
            });
            
            return updatedPlan;
        } catch (error: any) {
            console.error("[UpdateSubscriptionPlanService] Failed:", error);

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

export { UpdateSubscriptionPlanService };