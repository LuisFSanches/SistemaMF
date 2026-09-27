import { Request, Response, NextFunction } from "express";
import prismaClient from "../../prisma";
import { PreviewSegmentService } from "../../services/segment/PreviewSegmentService";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

class PreviewSegmentController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const segment = await prismaClient.segment.findFirst({
            where: {
                id,
                ...(store_id ? { store_id } : {}),
            },
            include: {
                clients: { select: { client_id: true } },
            },
        });

        if (!segment) {
            throw new BadRequestException("Segment not found", ErrorCodes.SEGMENT_NOT_FOUND);
        }

        const previewSegmentService = new PreviewSegmentService();

        const result = await previewSegmentService.execute({
            store_id: segment.store_id,
            type: segment.type,
            criteria: (segment.criteria as any) ?? undefined,
            client_ids: segment.clients.map((c) => c.client_id),
            page,
            limit,
        });

        return res.json(result);
    }
}

export { PreviewSegmentController };
