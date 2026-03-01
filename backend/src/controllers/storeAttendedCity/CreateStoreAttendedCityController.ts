import { Request, Response, NextFunction } from 'express';
import { CreateStoreAttendedCityService } from '../../services/storeAttendedCity/CreateStoreAttendedCityService';

class CreateStoreAttendedCityController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { store_id, city, state } = req.body;

            const service = new CreateStoreAttendedCityService();
            const result = await service.execute({ store_id, city, state });

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { CreateStoreAttendedCityController };
