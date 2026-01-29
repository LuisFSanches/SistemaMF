import { Request, Response, NextFunction } from 'express';
import { GetAllStoreSchedulesService } from '../../services/storeSchedule/GetAllStoreSchedulesService';

class GetAllStoreSchedulesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id } = req.params;

        const getAllStoreSchedulesService = new GetAllStoreSchedulesService();

        const schedules = await getAllStoreSchedulesService.execute({ store_id });
        
        return res.json(schedules);
    }
}

export { GetAllStoreSchedulesController };
