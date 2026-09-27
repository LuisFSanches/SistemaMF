import { Request, Response, NextFunction } from "express";
import { DispatchCampaignService } from "../../services/campaign/DispatchCampaignService";

class DispatchCampaignController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const dispatchCampaignService = new DispatchCampaignService();

        const campaign = await dispatchCampaignService.execute(id, store_id);

        return res.json({ campaign });
    }
}

export { DispatchCampaignController };
