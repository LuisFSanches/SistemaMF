import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllOrderToReceiveService {
    async execute() {
        try {
            const ordersToReceive = await prismaClient.orderToReceive.findMany({
                include: {
                    order: {
                        select: {
                            code: true,
                            total: true,
                            payment_received: true,
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
                },
                orderBy: {
                    payment_due_date: 'asc'
                }
            });

            return ordersToReceive;
        } catch (error: any) {
            console.error("[GetAllOrderToReceiveService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllOrderToReceiveService };
