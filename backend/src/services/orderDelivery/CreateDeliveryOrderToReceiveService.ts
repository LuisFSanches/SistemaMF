import moment from 'moment-timezone';
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateDeliveryOrderToReceiveService {
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

        const existingOrderToReceive = await prismaClient.orderToReceive.findFirst({
            where: { order_id }
        });

        if (existingOrderToReceive) {
            throw new BadRequestException(
                "An order to receive already exists for this order",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        const payment_due_date = moment().tz('America/Sao_Paulo')
            .add(1, 'month')
            .set({ hour: 16, minute: 0, second: 0 })
            .toDate();

        const orderToReceive = await prismaClient.orderToReceive.create({
            data: {
                order_id,
                payment_due_date,
                type: 'BOLETO',
                store_id: order.store_id
            }
        });

        return orderToReceive;
    }
}

export { CreateDeliveryOrderToReceiveService };
