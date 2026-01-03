import { IStoreHoliday } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreHolidaySchema } from "../../schemas/store/updateStoreHoliday";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreHoliday extends Partial<IStoreHoliday> {
    id: string;
}

class UpdateStoreHolidayService {
    async execute({ id, ...data }: IUpdateStoreHoliday) {
        // Validação com Zod
        const parsed = updateStoreHolidaySchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se o feriado existe
        const existingHoliday = await prismaClient.storeHoliday.findUnique({
            where: { id },
        });

        if (!existingHoliday) {
            throw new BadRequestException(
                "Holiday not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            const holiday = await prismaClient.storeHoliday.update({
                where: { id },
                data,
            });

            console.log(`[UpdateStoreHolidayService] Holiday updated: ${holiday.id}`);
            return holiday;
        } catch (error: any) {
            console.error("[UpdateStoreHolidayService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreHolidayService };
