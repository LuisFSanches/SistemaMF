import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllStoreAttendedCitiesService {
    async execute(store_id: string) {
        if (!store_id) {
            throw new BadRequestException("store_id is required", ErrorCodes.VALIDATION_ERROR);
        }

        try {
            const cities = await prismaClient.storeAttendedCity.findMany({
                where: { store_id },
                orderBy: { city: 'asc' },
            });

            return cities;
        } catch (error: any) {
            console.error("[GetAllStoreAttendedCitiesService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { GetAllStoreAttendedCitiesService };
