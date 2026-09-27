import { Request, Response, NextFunction } from "express";
import { UpdateSpecialDateService } from "../../services/specialDate/UpdateSpecialDateService";

class UpdateSpecialDateController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;
        const { name, date } = req.body;

        const updateSpecialDateService = new UpdateSpecialDateService();

        const specialDate = await updateSpecialDateService.execute(id, store_id, {
            name,
            date,
        });

        return res.json({ specialDate });
    }
}

export { UpdateSpecialDateController };
