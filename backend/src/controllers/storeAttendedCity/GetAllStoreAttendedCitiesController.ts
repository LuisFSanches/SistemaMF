import { Request, Response, NextFunction } from 'express';
import { GetAllStoreAttendedCitiesService } from '../../services/storeAttendedCity/GetAllStoreAttendedCitiesService';

class GetAllStoreAttendedCitiesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { store_id } = req.params;

            const service = new GetAllStoreAttendedCitiesService();
            const result = await service.execute(store_id);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { GetAllStoreAttendedCitiesController };
