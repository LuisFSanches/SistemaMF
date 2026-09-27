import { Request, Response, NextFunction } from "express";
import { UpdateSegmentService } from "../../services/segment/UpdateSegmentService";

class UpdateSegmentController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;
        const { name, description, type, criteria, client_ids } = req.body;

        const updateSegmentService = new UpdateSegmentService();

        const segment = await updateSegmentService.execute(id, store_id, {
            name,
            description,
            type,
            criteria,
            client_ids,
        });

        return res.json({ segment });
    }
}

export { UpdateSegmentController };
