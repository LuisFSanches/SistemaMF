import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface DeleteDeliveryManRequest {
    id: string
    store_id?: string
}

class DeleteDeliveryManService {
    async execute({ id, store_id }: DeleteDeliveryManRequest) {
        const whereClause: any = { id };
        if (store_id) {
            whereClause.store_id = store_id;
        }

        const existingDeliveryMan = await prismaClient.deliveryMan.findFirst({
            where: whereClause
        });

        if (!existingDeliveryMan) {
            throw new BadRequestException(
                "Delivery man not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            await prismaClient.deliveryMan.delete({
                where: { id }
            });
            
            return { message: "Delivery man deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteDeliveryManService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteDeliveryManService };
