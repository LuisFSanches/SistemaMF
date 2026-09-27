import { Request, Response, NextFunction } from "express";
import { CreateSegmentService } from "../../services/segment/CreateSegmentService";

class CreateSegmentController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { name, description, type, criteria, client_ids } = req.body;

        const createSegmentService = new CreateSegmentService();

        const segment = await createSegmentService.execute({
            store_id,
            name,
            description,
            type,
            criteria,
            client_ids,
        });

        return res.json({ segment });
    }
}

export { CreateSegmentController };
