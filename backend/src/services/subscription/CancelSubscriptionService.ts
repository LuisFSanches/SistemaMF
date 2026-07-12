import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class CancelSubscriptionService {
    async execute(storeId: string) {
        // 1. Validar se o ID foi fornecido
        if (!storeId) {
            throw new BadRequestException(
                "Store ID is required",
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

            // 3. Verificar se já não está cancelada
            if (existingSubscription.status === 'CANCELLED') {
                throw new BadRequestException(
                    "Subscription is already cancelled",
                    ErrorCodes.BAD_REQUEST
                );
            }

            // 4. Cancelar a assinatura
            const cancelledSubscription = await prismaClient.$transaction(async (tx) => {
                const cancelledSub = await tx.subscription.update({
                    where: { store_id: storeId },
                    data: {
                        status: 'CANCELLED',
                        end_date: new Date()
                    },
                    include: {
                        subscriptionPlan: true,
                        store: true
                    }
                });

                // Atualizar status na Store
                await tx.store.update({
                    where: { id: storeId },
                    data: {
                        subscription_status: 'INACTIVE'
                    }
                });

                return cancelledSub;
            });
            
            return cancelledSubscription;
        } catch (error: any) {
            console.error("[CancelSubscriptionService] Failed:", error);

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

export { CancelSubscriptionService };