import { Request, Response, NextFunction } from 'express';
import { GetProductSalesReportService } from '../../services/reports/GetProductSalesReportService';

class GetProductSalesReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { 
            page = '1', 
            pageSize = '50',
            start_date,
            end_date,
            product_name,
            category_id
        } = req.query;

        const filters = {
            page: Number(page),
            pageSize: Number(pageSize),
            start_date: start_date as string | undefined,
            end_date: end_date as string | undefined,
            product_name: product_name as string | undefined,
            category_id: category_id as string | undefined
        };

        const service = new GetProductSalesReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetProductSalesReportController };
