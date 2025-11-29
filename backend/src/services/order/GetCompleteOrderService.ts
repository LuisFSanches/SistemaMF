import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetCompleteOrderService {
    async execute(id: any) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: id
                },
                include: {
                    client: true,
                }
            });

            if (!order) {
                return { error: true, message: 'Order not found', code: ErrorCodes.BAD_REQUEST }
            }

            return order;
        }
        catch(error: any) {
            throw new BadRequestException(
                "Client already created",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }
    }
}

export { GetCompleteOrderService };
