import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetAllStoreSchedules {
    store_id: string;
}

class GetAllStoreSchedulesService {
    async execute({ store_id }: IGetAllStoreSchedules) {
        try {
            const schedules = await prismaClient.storeSchedule.findMany({
                where: { store_id },
                orderBy: {
                    day_of_week: 'asc',
                },
            });

            return schedules;
        } catch (error: any) {
            console.error("[GetAllStoreSchedulesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoreSchedulesService };
