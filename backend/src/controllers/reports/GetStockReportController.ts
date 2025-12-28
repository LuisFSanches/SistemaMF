import { Request, Response, NextFunction } from 'express';
import { GetStockReportService } from '../../services/reports/GetStockReportService';

class GetStockReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const service = new GetStockReportService();

        const report = await service.execute();

        return res.json(report);
    }
}

export { GetStockReportController };
