import { Request, Response, NextFunction } from "express";
import { DeleteCampaignService } from "../../services/campaign/DeleteCampaignService";

class DeleteCampaignController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const deleteCampaignService = new DeleteCampaignService();

        const result = await deleteCampaignService.execute(id, store_id);

        return res.json(result);
    }
}

export { DeleteCampaignController };
