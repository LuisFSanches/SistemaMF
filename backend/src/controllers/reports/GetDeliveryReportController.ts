import { Request, Response, NextFunction } from 'express';
import { GetDeliveryReportService } from '../../services/reports/GetDeliveryReportService';

class GetDeliveryReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const filters = req.query;

        const service = new GetDeliveryReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetDeliveryReportController };
