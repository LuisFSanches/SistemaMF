import { Request, Response, NextFunction } from "express";
import { GetAllStockTransactionsService } from "../../services/stockTransaction/GetAllStockTransactionsService";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllStockTransactionsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { page = '1', pageSize = '10', query = '' } = req.query;
        const getAllService = new GetAllStockTransactionsService();

        const transactions = await getAllService.execute(
            Number(page),
            Number(pageSize),
            String(query)
        );

        if ('error' in transactions && transactions.error) {
            next(new BadRequestException(
                transactions.message,
                transactions.code
            ));
        }

        return res.json(transactions);
    }
}

export { GetAllStockTransactionsController };
