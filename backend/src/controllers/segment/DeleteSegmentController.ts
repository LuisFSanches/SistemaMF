import { Request, Response, NextFunction } from "express";
import { DeleteSegmentService } from "../../services/segment/DeleteSegmentService";

class DeleteSegmentController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const deleteSegmentService = new DeleteSegmentService();

        const result = await deleteSegmentService.execute(id, store_id);

        return res.json(result);
    }
}

export { DeleteSegmentController };
