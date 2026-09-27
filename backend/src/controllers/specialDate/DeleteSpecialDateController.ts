import { Request, Response, NextFunction } from "express";
import { DeleteSpecialDateService } from "../../services/specialDate/DeleteSpecialDateService";

class DeleteSpecialDateController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const store_id = req.admin?.store_id || undefined;

        const deleteSpecialDateService = new DeleteSpecialDateService();

        const result = await deleteSpecialDateService.execute(id, store_id);

        return res.json(result);
    }
}

export { DeleteSpecialDateController };
