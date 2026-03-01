import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteDeliveryRangeService {
    async execute(id: string) {
        if (!id) {
            throw new BadRequestException("id is required", ErrorCodes.VALIDATION_ERROR);
        }

        const existing = await prismaClient.deliveryRange.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new BadRequestException("Delivery range not found", ErrorCodes.USER_NOT_FOUND);
        }

        try {
            await prismaClient.deliveryRange.delete({ where: { id } });
            return { message: "Delivery range deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteDeliveryRangeService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { DeleteDeliveryRangeService };
