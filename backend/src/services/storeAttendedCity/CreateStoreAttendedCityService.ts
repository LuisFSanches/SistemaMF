import { IStoreAttendedCity } from "../../interfaces/IStoreAttendedCity";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreAttendedCitySchema } from "../../schemas/storeAttendedCity/createStoreAttendedCity";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStoreAttendedCityService {
    async execute(data: IStoreAttendedCity) {
        const parsed = createStoreAttendedCitySchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existing = await prismaClient.storeAttendedCity.findFirst({
            where: {
                store_id: data.store_id,
                city: { equals: data.city, mode: 'insensitive' },
                state: { equals: data.state, mode: 'insensitive' },
            },
        });

        if (existing) {
            throw new BadRequestException(
                "This city is already registered for this store",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const attendedCity = await prismaClient.storeAttendedCity.create({
                data: {
                    store_id: data.store_id,
                    city: data.city,
                    state: data.state,
                },
            });

            return attendedCity;
        } catch (error: any) {
            console.error("[CreateStoreAttendedCityService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { CreateStoreAttendedCityService };
