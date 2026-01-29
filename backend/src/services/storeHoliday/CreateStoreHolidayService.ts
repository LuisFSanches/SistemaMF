import { IStoreHoliday } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreHolidaySchema } from "../../schemas/store/createStoreHoliday";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStoreHolidayService {
    async execute(data: IStoreHoliday) {
        // Validação com Zod
        const parsed = createStoreHolidaySchema.safeParse(data);

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

        // Converter data para objeto Date se for string
        const holidayDate = typeof data.date === 'string' ? new Date(data.date) : data.date;

        // Verificar se já existe feriado para essa data
        const existingHoliday = await prismaClient.storeHoliday.findFirst({
            where: {
                store_id: data.store_id,
                date: holidayDate,
            },
        });

        if (existingHoliday) {
            throw new BadRequestException(
                "Holiday for this date already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const holiday = await prismaClient.storeHoliday.create({
                data: {
                    store_id: data.store_id,
                    date: holidayDate,
                    name: data.name,
                    description: data.description,
                    is_closed: data.is_closed ?? true,
                },
            });

            console.log(`[CreateStoreHolidayService] Holiday created: ${holiday.id}`);
            return holiday;
        } catch (error: any) {
            console.error("[CreateStoreHolidayService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStoreHolidayService };
