import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class ConfirmDeliveryPaymentService {
    async execute(order_id: string) {
        const order = await prismaClient.order.findFirst({
            where: { id: order_id, status: 'IN_DELIVERY' }
        });

        if (!order) {
            throw new BadRequestException(
                "Order not found or not in delivery",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        const updateOrder = await prismaClient.order.update({
            where: { id: order_id },
            data: { payment_received: true },
            include: {
                client: true,
                clientAddress: true
            }
        });

        return updateOrder;
    }
}

export { ConfirmDeliveryPaymentService };
