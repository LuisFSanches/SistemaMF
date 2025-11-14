import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IGetOrderToReceive {
    id: string;
}

class GetOrderToReceiveService {
    async execute({ id }: IGetOrderToReceive) {
        if (!id) {
            throw new BadRequestException(
                "id is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const orderToReceive = await prismaClient.orderToReceive.findUnique({
                where: { id },
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

            if (!orderToReceive) {
                throw new BadRequestException(
                    "Order to receive not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return orderToReceive;
        } catch (error: any) {
            console.error("[GetOrderToReceiveService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetOrderToReceiveService };
