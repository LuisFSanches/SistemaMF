import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface ICheckOrderToReceiveExists {
    order_id: string;
}

class CheckOrderToReceiveExistsService {
    async execute({ order_id }: ICheckOrderToReceiveExists) {
        if (!order_id) {
            throw new BadRequestException(
                "order_id is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const orderToReceive = await prismaClient.orderToReceive.findFirst({
                where: { order_id },
            });

            return { exists: !!orderToReceive };
        } catch (error: any) {
            console.error("[CheckOrderToReceiveExistsService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CheckOrderToReceiveExistsService };
