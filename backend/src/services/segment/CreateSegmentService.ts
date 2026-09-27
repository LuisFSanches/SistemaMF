import prismaClient from "../../prisma";
import { createSegmentSchema } from "../../schemas/segment/createSegmentSchema";
import { SegmentCriteria } from "../../schemas/segment/segmentCriteriaSchema";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface ICreateSegmentData {
    store_id?: string | null;
    name: string;
    description?: string | null;
    type: "DYNAMIC" | "MANUAL";
    criteria?: SegmentCriteria;
    client_ids?: string[];
}

export class CreateSegmentService {
    async execute(data: ICreateSegmentData) {
        try {
            const validatedData = createSegmentSchema.parse(data);

            if (validatedData.type === "MANUAL") {
                await this.validateClientIdsExist(validatedData.client_ids!);
            }

            const segment = await prismaClient.$transaction(async (tx) => {
                const created = await tx.segment.create({
                    data: {
                        store_id: validatedData.store_id,
                        name: validatedData.name,
                        description: validatedData.description,
                        type: validatedData.type,
                        criteria: validatedData.type === "DYNAMIC" ? validatedData.criteria : undefined,
                    },
                });

                if (validatedData.type === "MANUAL") {
                    await tx.segmentClient.createMany({
                        data: validatedData.client_ids!.map((client_id) => ({
                            segment_id: created.id,
                            client_id,
                        })),
                    });
                }

                return created;
            });

            return segment;
        } catch (error: any) {
            console.error("[CreateSegmentService] Failed to create segment:", error);
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
