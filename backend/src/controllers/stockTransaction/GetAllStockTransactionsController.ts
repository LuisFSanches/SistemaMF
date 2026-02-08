import { Request, Response, NextFunction } from "express";
import { GetAllStockTransactionsService } from "../../services/stockTransaction/GetAllStockTransactionsService";

class GetAllStockTransactionsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { page = '1', pageSize = '10', query = '' } = req.query;
        const getAllService = new GetAllStockTransactionsService();

        const transactions = await getAllService.execute(
            Number(page),
            Number(pageSize),
            String(query),
            store_id
        );

        return res.json(transactions);
    }
}

export { GetAllStockTransactionsController };
