import { Request, Response, NextFunction } from "express";
import { CreateSpecialDateService } from "../../services/specialDate/CreateSpecialDateService";

class CreateSpecialDateController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { name, date } = req.body;

        const createSpecialDateService = new CreateSpecialDateService();

        const specialDate = await createSpecialDateService.execute({
            store_id,
            name,
            date,
        });

        return res.json({ specialDate });
    }
}

export { CreateSpecialDateController };
