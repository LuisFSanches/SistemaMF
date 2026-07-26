import { Request, Response, NextFunction } from "express";
import { GetSupplierStockDetailsService } from "../../services/stockTransaction/GetSupplierStockDetailsService";

class GetSupplierStockDetailsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const { id } = req.params;

        const getSupplierStockDetailsService = new GetSupplierStockDetailsService();

        const stockDetails = await getSupplierStockDetailsService.execute(id, store_id);

        return res.json(stockDetails);
    }
}

export { GetSupplierStockDetailsController };
