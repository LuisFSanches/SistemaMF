import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface DeleteOrderDeliveryRequest {
    id: string
}

class DeleteOrderDeliveryService {
    async execute({ id }: DeleteOrderDeliveryRequest) {
        // Verificar se a entrega existe
        const existingOrderDelivery = await prismaClient.orderDelivery.findFirst({
            where: { id }
        });

        if (!existingOrderDelivery) {
            throw new BadRequestException(
                "Order delivery not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Deletar entrega
        try {
            await prismaClient.orderDelivery.delete({
                where: { id }
            });
            
            return { message: "Order delivery deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteOrderDeliveryService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteOrderDeliveryService };
