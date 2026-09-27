import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class GetSegmentDetailsService {
    async execute(segmentId: string, store_id?: string) {
        try {
            const segment = await prismaClient.segment.findFirst({
                where: {
                    id: segmentId,
                    ...(store_id ? { store_id } : {}),
                },
                include: {
                    clients: {
                        include: {
                            client: {
                                select: {
                                    id: true,
                                    first_name: true,
                                    last_name: true,
                                    phone_number: true,
                                    country_code: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!segment) {
                throw new BadRequestException(
                    "Segment not found",
                    ErrorCodes.SEGMENT_NOT_FOUND
                );
            }

            return segment;
        } catch (error: any) {
            console.error("[GetSegmentDetailsService] Failed to get segment details:", error);
            throw error;
        }
    }
}
