import { ISubscriptionStatus } from "../../interfaces/ISubscription";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { checkSubscriptionStatusSchema } from "../../schemas/subscription/subscription";
import { BadRequestException } from "../../exceptions/bad-request";

class CheckSubscriptionStatusService {
    async execute(storeId: string): Promise<ISubscriptionStatus> {
        // 1. Validação com Zod
        const parsed = checkSubscriptionStatusSchema.safeParse({ store_id: storeId });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 2. Buscar a loja com dados de assinatura
            const store = await prismaClient.store.findUnique({
                where: { id: storeId },
                include: {
                    subscription: {
                        include: {
                            subscriptionPlan: true
                        }
                    }
                }
            });

            if (!store) {
                throw new BadRequestException(
                    "Store not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            const now = new Date();

            // 3. Caso não tenha assinatura - está no período trial
            if (!store.subscription) {
                const trialEndDate = store.trial_end_date || new Date(store.created_at.getTime() + 7 * 24 * 60 * 60 * 1000);
                const isTrialExpired = now > trialEndDate;
                const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

                return {
                    store_id: storeId,
                    is_trial: !isTrialExpired,
                    is_active: !isTrialExpired,
                    days_remaining: isTrialExpired ? 0 : daysRemaining,
                    trial_end_date: trialEndDate
                };
            }

            const subscription = store.subscription;
            const plan = subscription.subscriptionPlan;

            // 4. Verificar status da assinatura
            let isActive = false;
            let isTrial = false;
            let daysRemaining: number | undefined;

            switch (subscription.status) {
                case 'ACTIVE':
                    isActive = true;
                    // Verificar se ainda está no período de trial
                    if (subscription.trial_end_date && now <= subscription.trial_end_date) {
                        isTrial = true;
                        daysRemaining = Math.ceil((subscription.trial_end_date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                    }
                    break;
                
                case 'PENDING':
                    // Verificar se ainda está no período de trial
                    if (subscription.trial_end_date && now <= subscription.trial_end_date) {
                        isTrial = true;
                        isActive = true;
                        daysRemaining = Math.ceil((subscription.trial_end_date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                    }
                    break;
                
                case 'EXPIRED':
                case 'CANCELLED':
                    isActive = false;
                    break;
            }

            // 5. Retornar status completo
            return {
                store_id: storeId,
                is_trial: isTrial,
                is_active: isActive,
                days_remaining: daysRemaining,
                current_plan: {
                    id: plan.id,
                    name: plan.name,
                    price: plan.price,
                    billing_cycle: plan.billing_cycle
                },
                trial_end_date: subscription.trial_end_date || null,
                next_billing_date: subscription.next_billing_date || null
            };

        } catch (error: any) {
            console.error("[CheckSubscriptionStatusService] Failed:", error);

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

export { CheckSubscriptionStatusService };