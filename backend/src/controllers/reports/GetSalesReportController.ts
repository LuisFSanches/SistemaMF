import { Request, Response, NextFunction } from 'express';
import { GetSalesReportService } from '../../services/reports/GetSalesReportService';

class GetSalesReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const filters = req.query;

        const service = new GetSalesReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetSalesReportController };
