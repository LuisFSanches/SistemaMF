import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class DeleteSpecialDateService {
    async execute(specialDateId: string, store_id?: string) {
        try {
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

            const dependentSegments = await prismaClient.segment.findMany({
                where: {
                    type: "DYNAMIC",
                    criteria: {
                        path: ["purchase_recency", "special_date_id"],
                        equals: specialDateId,
                    },
                },
                select: { id: true, name: true },
            });

            if (dependentSegments.length > 0) {
                const segmentNames = dependentSegments.map((s) => s.name).join(", ");
                throw new BadRequestException(
                    `Não é possível deletar: está sendo usado pelo segmento: ${segmentNames}`,
                    ErrorCodes.SPECIAL_DATE_IN_USE
                );
            }

            await prismaClient.specialDate.delete({
                where: { id: specialDateId },
            });

            return { success: true };
        } catch (error: any) {
            console.error("[DeleteSpecialDateService] Failed to delete special date:", error);
            throw error;
        }
    }
}
