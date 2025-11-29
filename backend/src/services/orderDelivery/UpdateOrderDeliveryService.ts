import { IOrderDelivery } from "../../interfaces/IOrderDelivery";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateOrderDeliverySchema } from "../../schemas/orderDelivery/updateOrderDelivery";
import { BadRequestException } from "../../exceptions/bad-request";

interface UpdateOrderDeliveryRequest extends Partial<IOrderDelivery> {
    id: string
}

class UpdateOrderDeliveryService {
    async execute({ id, ...data }: UpdateOrderDeliveryRequest) {
        // Validação com Zod
        const parsed = updateOrderDeliverySchema.safeParse({
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

        // Verificar se a entrega existe
        const existingOrderDelivery = await prismaClient.orderDelivery.findFirst({
            where: { id }
        });

        if (!existingOrderDelivery) {
            throw new BadRequestException(
                "Order delivery not found",
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

        // Atualizar entrega
        try {
            const orderDelivery = await prismaClient.orderDelivery.update({
                where: { id },
                data: {
                    delivery_man_id: parsed.data.delivery_man_id,
                    delivery_date: parsed.data.delivery_date 
                        ? new Date(parsed.data.delivery_date) 
                        : undefined,
                    is_paid: parsed.data.is_paid,
                    is_archived: parsed.data.is_archived
                },
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
            
            return orderDelivery;
        } catch (error: any) {
            console.error("[UpdateOrderDeliveryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateOrderDeliveryService };
