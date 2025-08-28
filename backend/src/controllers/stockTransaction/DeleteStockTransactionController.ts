import { Request, Response, NextFunction } from "express";
import { DeleteStockTransactionService } from "../../services/stockTransaction/DeleteStockTransactionService";

class DeleteStockTransactionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteService = new DeleteStockTransactionService();

        const transaction = await deleteService.execute(id);

        return res.json(transaction);
    }
}

export { DeleteStockTransactionController };
