import { Request, Response, NextFunction } from "express";
import { CreateStockTransactionService } from "../../services/stockTransaction/CreateStockTransactionService";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStockTransactionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { product_id, supplier, unity, quantity, unity_price, purchased_date, total_price } = req.body;

        const createStockTransactionService = new CreateStockTransactionService();

        const transaction = await createStockTransactionService.execute({
            product_id,
            supplier,
            unity,
            quantity,
            unity_price,
            purchased_date,
            total_price
        });

        if ('error' in transaction && transaction.error) {
            next(new BadRequestException(
                transaction.message,
                transaction.code
            ));
        }

        return res.json(transaction);
    }
}

export { CreateStockTransactionController };
