import { IStoreSchedule } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreScheduleSchema } from "../../schemas/store/createStoreSchedule";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStoreScheduleService {
    async execute(data: IStoreSchedule) {
        // Validação com Zod
        const parsed = createStoreScheduleSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se a loja existe
        const store = await prismaClient.store.findUnique({
            where: { id: data.store_id },
        });

        if (!store) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se já existe horário para esse dia da semana
        const existingSchedule = await prismaClient.storeSchedule.findFirst({
            where: {
                store_id: data.store_id,
                day_of_week: data.day_of_week,
            },
        });

        if (existingSchedule) {
            throw new BadRequestException(
                "Schedule for this day already exists. Use update instead.",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const schedule = await prismaClient.storeSchedule.create({
                data: {
                    store_id: data.store_id,
                    day_of_week: data.day_of_week,
                    is_closed: data.is_closed ?? false,
                    opening_time: data.opening_time,
                    closing_time: data.closing_time,
                    lunch_break_start: data.lunch_break_start,
                    lunch_break_end: data.lunch_break_end,
                },
            });

            console.log(`[CreateStoreScheduleService] Schedule created: ${schedule.id}`);
            return schedule;
        } catch (error: any) {
            console.error("[CreateStoreScheduleService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStoreScheduleService };
