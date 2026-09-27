import prismaClient from "../../prisma";
import { updateSegmentSchema } from "../../schemas/segment/updateSegmentSchema";
import { SegmentCriteria } from "../../schemas/segment/segmentCriteriaSchema";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IUpdateSegmentData {
    name?: string;
    description?: string | null;
    type?: "DYNAMIC" | "MANUAL";
    criteria?: SegmentCriteria;
    client_ids?: string[];
}

export class UpdateSegmentService {
    async execute(segmentId: string, store_id: string | undefined, data: IUpdateSegmentData) {
        try {
            const validatedData = updateSegmentSchema.parse(data);

            const existingSegment = await prismaClient.segment.findFirst({
                where: {
                    id: segmentId,
                    ...(store_id ? { store_id } : {}),
                },
            });

            if (!existingSegment) {
                throw new BadRequestException(
                    "Segment not found",
                    ErrorCodes.SEGMENT_NOT_FOUND
                );
            }

            const resolvedType = validatedData.type ?? existingSegment.type;

            if (resolvedType === "MANUAL" && validatedData.client_ids) {
                await this.validateClientIdsExist(validatedData.client_ids);
            }

            const segment = await prismaClient.$transaction(async (tx) => {
                const updated = await tx.segment.update({
                    where: { id: segmentId },
                    data: {
                        name: validatedData.name,
                        description: validatedData.description,
                        type: validatedData.type,
                        criteria: resolvedType === "DYNAMIC" ? validatedData.criteria : undefined,
                    },
                });

                if (resolvedType === "MANUAL" && validatedData.client_ids) {
                    await tx.segmentClient.deleteMany({ where: { segment_id: segmentId } });
                    await tx.segmentClient.createMany({
                        data: validatedData.client_ids.map((client_id) => ({
                            segment_id: segmentId,
                            client_id,
                        })),
                    });
                }

                return updated;
            });

            return segment;
        } catch (error: any) {
            console.error("[UpdateSegmentService] Failed to update segment:", error);
            throw error;
        }
    }

    private async validateClientIdsExist(clientIds: string[]) {
        const existingClients = await prismaClient.client.findMany({
            where: { id: { in: clientIds } },
            select: { id: true },
        });

        if (existingClients.length !== clientIds.length) {
            throw new BadRequestException(
                "One or more specified customers were not found",
                ErrorCodes.CLIENT_NOT_FOUND
            );
        }
    }
}
