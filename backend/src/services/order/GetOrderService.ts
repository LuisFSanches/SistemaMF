import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetOrderService {
    async execute(id: any) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: id
                }
            });

            if (!order) {
                return { error: true, message: 'Order not found', code: ErrorCodes.BAD_REQUEST }
            }

            return order;
        }
        catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { GetOrderService };
