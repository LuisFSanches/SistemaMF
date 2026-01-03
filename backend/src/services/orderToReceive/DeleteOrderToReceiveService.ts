import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IDeleteOrderToReceive {
    id: string;
    store_id?: string;
}

class DeleteOrderToReceiveService {
    async execute({ id, store_id }: IDeleteOrderToReceive) {
        if (!id) {
            throw new BadRequestException(
                "id is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se existe
        const whereClause: any = { id };
        if (store_id) {
            whereClause.store_id = store_id;
        }

        const orderToReceiveExists = await prismaClient.orderToReceive.findFirst({
            where: whereClause,
        });

        if (!orderToReceiveExists) {
            throw new BadRequestException(
                "Order to receive not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            await prismaClient.orderToReceive.delete({
                where: { id }
            });

            return { message: "Order to receive deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteOrderToReceiveService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteOrderToReceiveService };
