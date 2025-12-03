import { IUpdateMultipleOrderDeliveries } from "../../interfaces/IUpdateMultipleOrderDeliveries";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateMultipleOrderDeliveriesSchema } from "../../schemas/orderDelivery/updateMultipleOrderDeliveries";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateMultipleOrderDeliveriesService {
    async execute(data: IUpdateMultipleOrderDeliveries) {
        // Validação com Zod
        const parsed = updateMultipleOrderDeliveriesSchema.safeParse({
            ...data,
            delivery_date: data.delivery_date 
                ? (data.delivery_date instanceof Date 
                    ? data.delivery_date.toISOString() 
                    : data.delivery_date)
                : undefined
        });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se todos os IDs existem
        const existingOrderDeliveries = await prismaClient.orderDelivery.findMany({
            where: { id: { in: parsed.data.ids } }
        });

        if (existingOrderDeliveries.length !== parsed.data.ids.length) {
            throw new BadRequestException(
                "One or more order deliveries not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Se está atualizando o motoboy, verificar se existe
        if (parsed.data.delivery_man_id) {
            const deliveryManExists = await prismaClient.deliveryMan.findFirst({
                where: { id: parsed.data.delivery_man_id }
            });

            if (!deliveryManExists) {
                throw new BadRequestException(
                    "Delivery man not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }
        }

        // Preparar dados para atualização
        const updateData: any = {};
        
        if (parsed.data.delivery_man_id !== undefined) {
            updateData.delivery_man_id = parsed.data.delivery_man_id;
        }
        
        if (parsed.data.delivery_date !== undefined) {
            updateData.delivery_date = new Date(parsed.data.delivery_date);
        }
        
        if (parsed.data.is_paid !== undefined) {
            updateData.is_paid = parsed.data.is_paid;
        }
        
        if (parsed.data.is_archived !== undefined) {
            updateData.is_archived = parsed.data.is_archived;
        }

        // Atualizar múltiplas entregas
        try {
            const result = await prismaClient.orderDelivery.updateMany({
                where: { id: { in: parsed.data.ids } },
                data: updateData
            });

            // Buscar entregas atualizadas para retornar com detalhes
            const updatedOrderDeliveries = await prismaClient.orderDelivery.findMany({
                where: { id: { in: parsed.data.ids } },
                include: {
                    order: {
                        select: {
                            code: true,
                            total: true,
                            client: {
                                select: {
                                    first_name: true,
                                    last_name: true,
                                    phone_number: true
                                }
                            },
                            clientAddress: {
                                select: {
                                    street: true,
                                    street_number: true,
                                    neighborhood: true,
                                    city: true
                                }
                            }
                        }
                    },
                    deliveryMan: {
                        select: {
                            name: true,
                            phone_number: true
                        }
                    }
                }
            });
            
            return {
                count: result.count,
                orderDeliveries: updatedOrderDeliveries
            };
        } catch (error: any) {
            console.error("[UpdateMultipleOrderDeliveriesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateMultipleOrderDeliveriesService };
