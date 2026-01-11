import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetStoreSchedule {
    id: string;
}

class GetStoreScheduleService {
    async execute({ id }: IGetStoreSchedule) {
        try {
            const schedule = await prismaClient.storeSchedule.findUnique({
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

            if (!schedule) {
                throw new BadRequestException(
                    "Schedule not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return schedule;
        } catch (error: any) {
            console.error("[GetStoreScheduleService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStoreScheduleService };
