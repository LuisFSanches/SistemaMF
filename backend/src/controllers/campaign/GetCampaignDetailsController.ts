import { Request, Response, NextFunction } from "express";
import { GetCampaignDetailsService } from "../../services/campaign/GetCampaignDetailsService";

class GetCampaignDetailsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const getCampaignDetailsService = new GetCampaignDetailsService();

        const campaign = await getCampaignDetailsService.execute(id, store_id);

        return res.json({ campaign });
    }
}

export { GetCampaignDetailsController };
