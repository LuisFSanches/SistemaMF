import { Request, Response, NextFunction } from 'express';
import { GetStoreScheduleService } from '../../services/storeSchedule/GetStoreScheduleService';

class GetStoreScheduleController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getStoreScheduleService = new GetStoreScheduleService();

        const schedule = await getStoreScheduleService.execute({ id });
        
        return res.json(schedule);
    }
}

export { GetStoreScheduleController };
