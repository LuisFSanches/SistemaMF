import { IOrderToReceive } from "../../interfaces/IOrderToReceive";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateOrderToReceiveSchema } from "../../schemas/orderToReceive/updateOrderToReceive";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateOrderToReceive {
    id: string;
    data: Partial<IOrderToReceive>;
}

class UpdateOrderToReceiveService {
    async execute({ id, data }: IUpdateOrderToReceive) {
        if (!id) {
            throw new BadRequestException(
                "id is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const parsed = updateOrderToReceiveSchema.safeParse({
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

        // Verificar se existe
        const orderToReceiveExists = await prismaClient.orderToReceive.findUnique({
            where: { id },
        });

        if (!orderToReceiveExists) {
            throw new BadRequestException(
                "Order to receive not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            const updatedOrderToReceive = await prismaClient.orderToReceive.update({
                where: { id },
                data: {
                    payment_due_date: data.payment_due_date,
                    received_date: data.received_date,
                    type: data.type,
                    is_archived: data.is_archived,
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

            return updatedOrderToReceive;
        } catch (error: any) {
            console.error("[UpdateOrderToReceiveService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateOrderToReceiveService };
