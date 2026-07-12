import { ICreateSubscriptionPlan } from "../../interfaces/ISubscriptionPlan";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createSubscriptionPlanSchema } from "../../schemas/subscription/subscriptionPlan";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateSubscriptionPlanService {
    async execute(data: ICreateSubscriptionPlan) {
        // 1. Validação com Zod
        const parsed = createSubscriptionPlanSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se já existe plano com mesmo nome e billing_cycle
        const existingPlan = await prismaClient.subscriptionPlan.findFirst({
            where: { 
                name: data.name,
                billing_cycle: data.billing_cycle 
            },
        });

        if (existingPlan) {
            throw new BadRequestException(
                "Subscription plan with this name and billing cycle already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // 3. Criar o plano de assinatura
        try {
            const subscriptionPlan = await prismaClient.subscriptionPlan.create({ 
                data: {
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    billing_cycle: data.billing_cycle,
                    mp_plan_id: data.mp_plan_id,
                    is_active: data.is_active ?? true
                }
            });
            
            return subscriptionPlan;
        } catch (error: any) {
            console.error("[CreateSubscriptionPlanService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateSubscriptionPlanService };