import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class ListDeliveryMenService {
    async execute(store_id?: string) {
        try {
            let filters: any = {
                active: true
            };

            if (store_id) {
                filters.store_id = store_id;
            }

            const deliveryMen = await prismaClient.deliveryMan.findMany({
                where: filters,
                orderBy: {
                    name: 'asc'
                }
            });

            return deliveryMen;
        } catch (error: any) {
            console.error("[ListDeliveryMenService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { ListDeliveryMenService };
