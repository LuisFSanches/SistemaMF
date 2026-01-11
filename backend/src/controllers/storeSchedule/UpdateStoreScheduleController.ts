import { Request, Response, NextFunction } from 'express';
import { UpdateStoreScheduleService } from '../../services/storeSchedule/UpdateStoreScheduleService';

class UpdateStoreScheduleController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const data = req.body;

        const updateStoreScheduleService = new UpdateStoreScheduleService();

        const schedule = await updateStoreScheduleService.execute({
            id,
            ...data,
        });
        
        return res.json(schedule);
    }
}

export { UpdateStoreScheduleController };
