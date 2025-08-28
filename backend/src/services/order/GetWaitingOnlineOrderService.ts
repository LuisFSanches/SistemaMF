import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetWaitingOnlineOrderService{
    async execute() {
        try {
            const orders = await prismaClient.order.findMany({
                where: {
                    status: 'WAITING_FOR_CLIENT'
                },
                include: {
                    client: true,
                    clientAddress: true,
                    createdBy: true
                },
                orderBy: {
                    code: 'desc'
                }
            });

            return { orders };

        } catch(error: any) {
            throw new BadRequestException(
                "Client already created",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }
    }
}

export { GetWaitingOnlineOrderService }
