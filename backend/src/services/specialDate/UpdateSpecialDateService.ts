import prismaClient from "../../prisma";
import { updateSpecialDateSchema } from "../../schemas/specialDate/updateSpecialDateSchema";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IUpdateSpecialDateData {
    name?: string;
    date?: Date;
}

export class UpdateSpecialDateService {
    async execute(specialDateId: string, store_id: string | undefined, data: IUpdateSpecialDateData) {
        try {
            const validatedData = updateSpecialDateSchema.parse(data);

            const existingSpecialDate = await prismaClient.specialDate.findFirst({
                where: {
                    id: specialDateId,
                    ...(store_id ? { store_id } : {}),
                },
            });

            if (!existingSpecialDate) {
                throw new BadRequestException(
                    "Special date not found",
                    ErrorCodes.SPECIAL_DATE_NOT_FOUND
                );
            }

            const specialDate = await prismaClient.specialDate.update({
                where: { id: specialDateId },
                data: validatedData,
            });

            return specialDate;
        } catch (error: any) {
            console.error("[UpdateSpecialDateService] Failed to update special date:", error);
            throw error;
        }
    }
}
