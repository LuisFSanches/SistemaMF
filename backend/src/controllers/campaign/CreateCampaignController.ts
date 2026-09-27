import { Request, Response, NextFunction } from "express";
import { CreateCampaignService } from "../../services/campaign/CreateCampaignService";

class CreateCampaignController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { name, segment_id, template_id, coupon_id, variable_values } = req.body;

        const createCampaignService = new CreateCampaignService();

        const campaign = await createCampaignService.execute({
            store_id,
            name,
            segment_id,
            template_id,
            coupon_id,
            variable_values,
        });

        return res.json({ campaign });
    }
}

export { CreateCampaignController };
