import { Request, Response, NextFunction } from 'express';
import { GetFinancialReportService } from '../../services/reports/GetFinancialReportService';

class GetFinancialReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const filters = req.query;

        const service = new GetFinancialReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetFinancialReportController };
