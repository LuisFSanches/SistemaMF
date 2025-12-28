import { Request, Response, NextFunction } from 'express';
import { GetTopProductsReportService } from '../../services/reports/GetTopProductsReportService';

class GetTopProductsReportController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { limit, offset, ...otherFilters } = req.query;

        const filters = {
            ...otherFilters,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        };

        const service = new GetTopProductsReportService();

        const report = await service.execute(filters);

        return res.json(report);
    }
}

export { GetTopProductsReportController };
