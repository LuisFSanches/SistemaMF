import { Request, Response, NextFunction } from "express";
import { GetSegmentDetailsService } from "../../services/segment/GetSegmentDetailsService";

class GetSegmentDetailsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const getSegmentDetailsService = new GetSegmentDetailsService();

        const segment = await getSegmentDetailsService.execute(id, store_id);

        return res.json({ segment });
    }
}

export { GetSegmentDetailsController };
