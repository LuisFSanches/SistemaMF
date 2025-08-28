import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetOnGoingOrderService {
    async execute() {
        try {
            const orders = await prismaClient.order.findMany({
                where: {
                    status: {
                        notIn: ['FINISHED', 'CANCELED', 'DONE']
                    }
                },
                orderBy: {
                    code: 'desc'
                },
                include: {
                    client: true,
                    clientAddress: true,
                    createdBy: true,
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });
            
            return orders;
        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetOnGoingOrderService };
