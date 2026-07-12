import { ICreateSubscription } from "../../interfaces/ISubscription";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createSubscriptionSchema } from "../../schemas/subscription/subscription";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateSubscriptionService {
    async execute(data: ICreateSubscription) {
        // 1. Validação com Zod
        const parsed = createSubscriptionSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // 2. Verificar se a loja existe
        const store = await prismaClient.store.findUnique({
            where: { id: data.store_id }
        });

        if (!store) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 3. Verificar se o plano de assinatura existe e está ativo
        const subscriptionPlan = await prismaClient.subscriptionPlan.findFirst({
            where: { 
                id: data.subscription_plan_id,
                is_active: true 
            }
        });

        if (!subscriptionPlan) {
            throw new BadRequestException(
                "Subscription plan not found or inactive",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // 4. Verificar se já existe uma assinatura ativa para esta loja
        const existingSubscription = await prismaClient.subscription.findFirst({
            where: { 
                store_id: data.store_id,
                status: { in: ['PENDING', 'ACTIVE'] }
            }
        });

        if (existingSubscription) {
            throw new BadRequestException(
                "Store already has an active subscription",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // 5. Criar a assinatura
        try {
            const startDate = data.start_date ? new Date(data.start_date) : new Date();
            const trialEndDate = data.trial_end_date ? new Date(data.trial_end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
            
            // Calcular próxima data de cobrança baseada no ciclo de cobrança
            let nextBillingDate: Date;
            if (subscriptionPlan.billing_cycle === 'MONTHLY') {
                nextBillingDate = new Date(trialEndDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days after trial
            } else { // ANNUAL
                nextBillingDate = new Date(trialEndDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days after trial
            }

            const subscription = await prismaClient.$transaction(async (tx) => {
                // Criar assinatura
                const newSubscription = await tx.subscription.create({
                    data: {
                        store_id: data.store_id,
                        subscription_plan_id: data.subscription_plan_id,
                        mp_subscription_id: data.mp_subscription_id,
                        status: data.status || 'PENDING',
                        start_date: startDate,
                        trial_end_date: trialEndDate,
                        next_billing_date: nextBillingDate,
                        end_date: data.end_date ? new Date(data.end_date) : null
                    },
                    include: {
                        subscriptionPlan: true,
                        store: true
                    }
                });

                // Atualizar campos de assinatura na Store
                await tx.store.update({
                    where: { id: data.store_id },
                    data: {
                        trial_end_date: trialEndDate,
                        subscription_status: 'TRIAL',
                        current_plan_id: data.subscription_plan_id
                    }
                });

                return newSubscription;
            });
            
            return subscription;
        } catch (error: any) {
            console.error("[CreateSubscriptionService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateSubscriptionService };