import { Request, Response, NextFunction } from 'express';
import { DeleteStoreAttendedCityService } from '../../services/storeAttendedCity/DeleteStoreAttendedCityService';

class DeleteStoreAttendedCityController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const service = new DeleteStoreAttendedCityService();
            const result = await service.execute(id);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export { DeleteStoreAttendedCityController };
