import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface DeleteDeliveryManRequest {
    id: string
}

class DeleteDeliveryManService {
    async execute({ id }: DeleteDeliveryManRequest) {
        const existingDeliveryMan = await prismaClient.deliveryMan.findFirst({
            where: { id }
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
