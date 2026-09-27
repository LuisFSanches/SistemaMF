import { Request, Response, NextFunction } from "express";
import { PreviewSegmentService } from "../../services/segment/PreviewSegmentService";
import { previewSegmentDraftSchema } from "../../schemas/segment/previewSegmentSchema";

class PreviewSegmentDraftController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { type, criteria, client_ids, page, limit } = previewSegmentDraftSchema.parse(req.body);

        const previewSegmentService = new PreviewSegmentService();

        const result = await previewSegmentService.execute({
            store_id,
            type,
            criteria,
            client_ids,
            page,
            limit,
        });

        return res.json(result);
    }
}

export { PreviewSegmentDraftController };
