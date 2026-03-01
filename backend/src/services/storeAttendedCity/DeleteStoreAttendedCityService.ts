import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteStoreAttendedCityService {
    async execute(id: string) {
        if (!id) {
            throw new BadRequestException("id is required", ErrorCodes.VALIDATION_ERROR);
        }

        const existing = await prismaClient.storeAttendedCity.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new BadRequestException("Attended city not found", ErrorCodes.USER_NOT_FOUND);
        }

        try {
            await prismaClient.storeAttendedCity.delete({ where: { id } });
            return { message: "Attended city deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreAttendedCityService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { DeleteStoreAttendedCityService };
