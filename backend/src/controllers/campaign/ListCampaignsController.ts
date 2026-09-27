import { Request, Response, NextFunction } from "express";
import { ListCampaignsService } from "../../services/campaign/ListCampaignsService";

class ListCampaignsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const listCampaignsService = new ListCampaignsService();

        const result = await listCampaignsService.execute({ store_id, page, limit });

        return res.json(result);
    }
}

export { ListCampaignsController };
