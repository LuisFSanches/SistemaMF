import { IOrderToReceive } from "../../interfaces/IOrderToReceive";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createOrderToReceiveSchema } from "../../schemas/orderToReceive/createOrderToReceive";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateOrderToReceiveService {
    async execute(data: IOrderToReceive) {
        const parsed = createOrderToReceiveSchema.safeParse({
            ...data,
            payment_due_date: data.payment_due_date instanceof Date 
                ? data.payment_due_date.toISOString() 
                : data.payment_due_date,
            received_date: data.received_date 
                ? (data.received_date instanceof Date 
                    ? data.received_date.toISOString() 
                    : data.received_date)
                : undefined
        });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se o pedido existe
        const orderExists = await prismaClient.order.findUnique({
            where: { id: data.order_id },
        });

        if (!orderExists) {
            throw new BadRequestException(
                "Order not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se já existe uma ordem a receber para este pedido
        const existingOrderToReceive = await prismaClient.orderToReceive.findFirst({
            where: { order_id: data.order_id },
        });

        if (existingOrderToReceive) {
            throw new BadRequestException(
                "An order to receive already exists for this order",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const orderToReceive = await prismaClient.orderToReceive.create({ 
                data: {
                    order_id: data.order_id,
                    payment_due_date: data.payment_due_date,
                    received_date: data.received_date,
                    type: data.type,
                    is_archived: data.is_archived || false
                },
                include: {
                    order: {
                        select: {
                            code: true,
                            total: true,
                            client: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                    phone_number: true
                                }
                            }
                        }
                    }
                }
            });
            
            return orderToReceive;
        } catch (error: any) {
            console.error("[CreateOrderToReceiveService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateOrderToReceiveService };
