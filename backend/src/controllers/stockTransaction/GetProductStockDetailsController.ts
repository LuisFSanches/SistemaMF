import { Request, Response, NextFunction } from "express";
import { GetProductStockDetailsService } from "../../services/stockTransaction/GetProductStockDetailsService";

class GetProductStockDetailsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;

        const getProductStockDetailsService = new GetProductStockDetailsService();

        const stockDetails = await getProductStockDetailsService.execute(id, store_id);

        return res.json(stockDetails);
    }
}

export { GetProductStockDetailsController };
