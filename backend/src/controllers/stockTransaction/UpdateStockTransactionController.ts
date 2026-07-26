import { Request, Response, NextFunction } from "express";
import { UpdateStockTransactionService } from "../../services/stockTransaction/UpdateStockTransactionService";

class UpdateStockTransactionController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;
        const { store_product_id, supplier, unity, quantity, unity_price, purchased_date, total_price } = req.body;

        const updateStockTransactionService = new UpdateStockTransactionService();

        const transaction = await updateStockTransactionService.execute({
            id,
            store_product_id,
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

export { UpdateStockTransactionController };
