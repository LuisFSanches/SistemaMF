import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreSchedulesSchema, ScheduleItemType } from "../../schemas/store/updateStoreSchedules";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreSchedules {
    store_id: string;
    schedules: ScheduleItemType[];
}

class UpdateStoreSchedulesService {
    async execute(data: IUpdateStoreSchedules) {
        const { store_id, schedules } = data;

        // Validação com Zod
        const parsed = updateStoreSchedulesSchema.safeParse({ schedules });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se store existe
        const existingStore = await prismaClient.store.findFirst({
            where: { id: store_id },
        });

        if (!existingStore) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            // Usar upsert para criar ou atualizar cada schedule
            const upsertPromises = schedules.map((schedule) => {
                return prismaClient.storeSchedule.upsert({
                    where: {
                        store_id_day_of_week: {
                            store_id: store_id,
                            day_of_week: schedule.day_of_week,
                        },
                    },
                    update: {
                        is_closed: schedule.is_closed ?? false,
                        opening_time: schedule.opening_time,
                        closing_time: schedule.closing_time,
                        lunch_break_start: schedule.lunch_break_start,
                        lunch_break_end: schedule.lunch_break_end,
                    },
                    create: {
                        store_id: store_id,
                        day_of_week: schedule.day_of_week,
                        is_closed: schedule.is_closed ?? false,
                        opening_time: schedule.opening_time,
                        closing_time: schedule.closing_time,
                        lunch_break_start: schedule.lunch_break_start,
                        lunch_break_end: schedule.lunch_break_end,
                    },
                });
            });

            const updatedSchedules = await Promise.all(upsertPromises);

            return {
                message: "Store schedules updated successfully",
                schedules: updatedSchedules,
            };
        } catch (error: any) {
            console.error("[UpdateStoreSchedulesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreSchedulesService };
