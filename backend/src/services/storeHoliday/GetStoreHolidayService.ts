import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetStoreHoliday {
    id: string;
}

class GetStoreHolidayService {
    async execute({ id }: IGetStoreHoliday) {
        try {
            const holiday = await prismaClient.storeHoliday.findUnique({
                where: { id },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });

            if (!holiday) {
                throw new BadRequestException(
                    "Holiday not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return holiday;
        } catch (error: any) {
            console.error("[GetStoreHolidayService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStoreHolidayService };
