import { Request, Response, NextFunction } from 'express';
import { GetTopClientsReportService } from '../../services/reports/GetTopClientsReportService';

class GetTopClientsReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { limit, offset, ...otherFilters } = req.query;

        const filters = {
            ...otherFilters,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        };

        const service = new GetTopClientsReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetTopClientsReportController };
