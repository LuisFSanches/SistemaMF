import { Request, Response, NextFunction } from "express";
import { DeleteStockTransactionService } from "../../services/stockTransaction/DeleteStockTransactionService";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteStockTransactionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteService = new DeleteStockTransactionService();

        const transaction = await deleteService.execute(id);

        if ('error' in transaction && transaction.error) {
            next(new BadRequestException(
                transaction.message,
                transaction.code
            ));
        }

        return res.json(transaction);
    }
}

export { DeleteStockTransactionController };
