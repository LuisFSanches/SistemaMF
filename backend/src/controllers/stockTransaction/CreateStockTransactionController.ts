import { Request, Response, NextFunction } from "express";
import { CreateStockTransactionService } from "../../services/stockTransaction/CreateStockTransactionService";

class CreateStockTransactionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { product_id, supplier, unity, quantity, unity_price, purchased_date, total_price } = req.body;

        const createStockTransactionService = new CreateStockTransactionService();

        const transaction = await createStockTransactionService.execute({
            product_id,
            supplier,
            unity,
            quantity,
            unity_price,
            purchased_date,
            total_price,
            store_id
        });

        return res.json(transaction);
    }
}

export { CreateStockTransactionController };
