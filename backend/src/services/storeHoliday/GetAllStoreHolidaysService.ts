import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetAllStoreHolidays {
    store_id: string;
}

class GetAllStoreHolidaysService {
    async execute({ store_id }: IGetAllStoreHolidays) {
        try {
            const holidays = await prismaClient.storeHoliday.findMany({
                where: { store_id },
                orderBy: {
                    date: 'asc',
                },
            });

            return holidays;
        } catch (error: any) {
            console.error("[GetAllStoreHolidaysService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoreHolidaysService };
