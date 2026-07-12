import { IUpdateSubscription } from "../../interfaces/ISubscription";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateSubscriptionSchema } from "../../schemas/subscription/subscription";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateSubscriptionService {
    async execute(storeId: string, data: IUpdateSubscription) {
        // 1. Validação com Zod
        const parsed = updateSubscriptionSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // 2. Verificar se a assinatura existe
            const existingSubscription = await prismaClient.subscription.findUnique({
                where: { store_id: storeId },
                include: { 
                    subscriptionPlan: true,
                    store: true 
                }
            });

            if (!existingSubscription) {
                throw new BadRequestException(
                    "Subscription not found for this store",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // 3. Se está mudando o plano, verificar se o novo plano existe e está ativo
            if (data.subscription_plan_id) {
                const newPlan = await prismaClient.subscriptionPlan.findFirst({
                    where: { 
                        id: data.subscription_plan_id,
                        is_active: true 
                    }
                });

                if (!newPlan) {
                    throw new BadRequestException(
                        "New subscription plan not found or inactive",
                        ErrorCodes.USER_NOT_FOUND
                    );
                }
            }

            // 4. Atualizar a assinatura
            const updatedSubscription = await prismaClient.$transaction(async (tx) => {
                const updatedSub = await tx.subscription.update({
                    where: { store_id: storeId },
                    data: {
                        ...(data.subscription_plan_id && { subscription_plan_id: data.subscription_plan_id }),
                        ...(data.mp_subscription_id !== undefined && { mp_subscription_id: data.mp_subscription_id }),
                        ...(data.status && { status: data.status }),
                        ...(data.start_date && { start_date: new Date(data.start_date) }),
                        ...(data.end_date !== undefined && { end_date: data.end_date ? new Date(data.end_date) : null }),
                        ...(data.next_billing_date && { next_billing_date: new Date(data.next_billing_date) }),
                        ...(data.trial_end_date && { trial_end_date: new Date(data.trial_end_date) })
                    },
                    include: {
                        subscriptionPlan: true,
                        store: true
                    }
                });

                // Atualizar campos relacionados na Store se necessário
                const storeUpdateData: any = {};
                
                if (data.status) {
                    switch (data.status) {
                        case 'ACTIVE':
                            storeUpdateData.subscription_status = 'ACTIVE';
                            break;
                        case 'EXPIRED':
                        case 'CANCELLED':
                            storeUpdateData.subscription_status = 'INACTIVE';
                            break;
                        case 'PENDING':
                            storeUpdateData.subscription_status = 'TRIAL';
                            break;
                    }
                }

                if (data.subscription_plan_id) {
                    storeUpdateData.current_plan_id = data.subscription_plan_id;
                }

                if (data.trial_end_date) {
                    storeUpdateData.trial_end_date = new Date(data.trial_end_date);
                }

                if (Object.keys(storeUpdateData).length > 0) {
                    await tx.store.update({
                        where: { id: storeId },
                        data: storeUpdateData
                    });
                }

                return updatedSub;
            });
            
            return updatedSubscription;
        } catch (error: any) {
            console.error("[UpdateSubscriptionService] Failed:", error);

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

export { UpdateSubscriptionService };