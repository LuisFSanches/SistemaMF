import { Request, Response, NextFunction } from "express";
import { ListSpecialDatesService } from "../../services/specialDate/ListSpecialDatesService";

class ListSpecialDatesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;

        const listSpecialDatesService = new ListSpecialDatesService();

        const result = await listSpecialDatesService.execute({ store_id });

        return res.json(result);
    }
}

export { ListSpecialDatesController };
