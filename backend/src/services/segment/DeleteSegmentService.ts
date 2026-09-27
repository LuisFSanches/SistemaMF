import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

export class DeleteSegmentService {
    async execute(segmentId: string, store_id?: string) {
        try {
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

            await prismaClient.segment.delete({
                where: { id: segmentId },
            });

            return { success: true };
        } catch (error: any) {
            console.error("[DeleteSegmentService] Failed to delete segment:", error);
            throw error;
        }
    }
}
