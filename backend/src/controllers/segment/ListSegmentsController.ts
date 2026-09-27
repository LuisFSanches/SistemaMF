import { Request, Response, NextFunction } from "express";
import { ListSegmentsService } from "../../services/segment/ListSegmentsService";

class ListSegmentsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const listSegmentsService = new ListSegmentsService();

        const result = await listSegmentsService.execute({ store_id, page, limit });

        return res.json(result);
    }
}

export { ListSegmentsController };
