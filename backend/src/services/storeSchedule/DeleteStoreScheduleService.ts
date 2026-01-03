import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IDeleteStoreSchedule {
    id: string;
}

class DeleteStoreScheduleService {
    async execute({ id }: IDeleteStoreSchedule) {
        // Verificar se o horário existe
        const existingSchedule = await prismaClient.storeSchedule.findUnique({
            where: { id },
        });

        if (!existingSchedule) {
            throw new BadRequestException(
                "Schedule not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            await prismaClient.storeSchedule.delete({
                where: { id },
            });

            console.log(`[DeleteStoreScheduleService] Schedule deleted: ${id}`);
            return { message: "Schedule deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreScheduleService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStoreScheduleService };
