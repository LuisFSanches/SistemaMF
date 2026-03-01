import { IDeliveryRange } from "../../interfaces/IDeliveryRange";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createDeliveryRangeSchema } from "../../schemas/deliveryRange/createDeliveryRange";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateDeliveryRangeService {
    async execute(data: IDeliveryRange) {
        const parsed = createDeliveryRangeSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Check for overlapping ranges for the same store
        const overlapping = await prismaClient.deliveryRange.findFirst({
            where: {
                store_id: data.store_id,
                OR: [
                    {
                        // New range starts inside an existing range
                        min_km: { lte: data.min_km },
                        max_km: { gt: data.min_km },
                    },
                    {
                        // New range ends inside an existing range
                        min_km: { lt: data.max_km },
                        max_km: { gte: data.max_km },
                    },
                    {
                        // New range completely contains an existing range
                        min_km: { gte: data.min_km },
                        max_km: { lte: data.max_km },
                    },
                ],
            },
        });

        if (overlapping) {
            throw new BadRequestException(
                `Range overlaps with existing range [${overlapping.min_km}km - ${overlapping.max_km}km]`,
                ErrorCodes.DELIVERY_RANGE_OVERLAP
            );
        }

        try {
            const range = await prismaClient.deliveryRange.create({
                data: {
                    store_id: data.store_id,
                    min_km: data.min_km,
                    max_km: data.max_km,
                    price: data.price,
                },
            });

            return range;
        } catch (error: any) {
            console.error("[CreateDeliveryRangeService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { CreateDeliveryRangeService };
