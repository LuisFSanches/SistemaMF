import { IStoreSchedule } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreScheduleSchema } from "../../schemas/store/updateStoreSchedule";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreSchedule extends Partial<IStoreSchedule> {
    id: string;
}

class UpdateStoreScheduleService {
    async execute({ id, ...data }: IUpdateStoreSchedule) {
        // Validação com Zod
        const parsed = updateStoreScheduleSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

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
            const schedule = await prismaClient.storeSchedule.update({
                where: { id },
                data,
            });

            console.log(`[UpdateStoreScheduleService] Schedule updated: ${schedule.id}`);
            return schedule;
        } catch (error: any) {
            console.error("[UpdateStoreScheduleService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreScheduleService };
