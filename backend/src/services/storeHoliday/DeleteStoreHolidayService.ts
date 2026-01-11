import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IDeleteStoreHoliday {
    id: string;
}

class DeleteStoreHolidayService {
    async execute({ id }: IDeleteStoreHoliday) {
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
            await prismaClient.storeHoliday.delete({
                where: { id },
            });

            console.log(`[DeleteStoreHolidayService] Holiday deleted: ${id}`);
            return { message: "Holiday deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreHolidayService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStoreHolidayService };
