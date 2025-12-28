import { Request, Response, NextFunction } from 'express';
import { GetSupplierReportService } from '../../services/reports/GetSupplierReportService';

class GetSupplierReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const filters = req.query;

        const service = new GetSupplierReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetSupplierReportController };
