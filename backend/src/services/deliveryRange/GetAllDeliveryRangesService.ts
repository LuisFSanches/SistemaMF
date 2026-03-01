import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllDeliveryRangesService {
    async execute(store_id: string) {
        if (!store_id) {
            throw new BadRequestException("store_id is required", ErrorCodes.VALIDATION_ERROR);
        }

        try {
            const ranges = await prismaClient.deliveryRange.findMany({
                where: { store_id },
                orderBy: { min_km: 'asc' },
            });

            return ranges;
        } catch (error: any) {
            console.error("[GetAllDeliveryRangesService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { GetAllDeliveryRangesService };
