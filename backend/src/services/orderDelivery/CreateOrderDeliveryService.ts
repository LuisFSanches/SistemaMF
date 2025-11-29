import { IOrderDelivery } from "../../interfaces/IOrderDelivery";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createOrderDeliverySchema } from "../../schemas/orderDelivery/createOrderDelivery";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateOrderDeliveryService {
    async execute(data: IOrderDelivery) {
        // Validação com Zod
        const parsed = createOrderDeliverySchema.safeParse({
            ...data,
            delivery_date: data.delivery_date instanceof Date 
                ? data.delivery_date.toISOString() 
                : data.delivery_date
        });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se o pedido existe
        const orderExists = await prismaClient.order.findFirst({
            where: { id: parsed.data.order_id }
        });

        if (!orderExists) {
            throw new BadRequestException(
                "Order not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se o motoboy existe
        const deliveryManExists = await prismaClient.deliveryMan.findFirst({
            where: { id: parsed.data.delivery_man_id }
        });

        if (!deliveryManExists) {
            throw new BadRequestException(
                "Delivery man not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se já existe uma entrega para este pedido
        const existingDelivery = await prismaClient.orderDelivery.findFirst({
            where: { order_id: parsed.data.order_id }
        });

        if (existingDelivery) {
            throw new BadRequestException(
                "Delivery already exists for this order",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // Criar entrega
        try {
            const orderDelivery = await prismaClient.orderDelivery.create({ 
                data: {
                    order_id: parsed.data.order_id,
                    delivery_man_id: parsed.data.delivery_man_id,
                    delivery_date: new Date(parsed.data.delivery_date),
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
            console.error("[CreateOrderDeliveryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateOrderDeliveryService };
