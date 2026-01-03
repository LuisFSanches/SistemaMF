import { Request, Response, NextFunction } from 'express';
import { CreateStoreScheduleService } from '../../services/storeSchedule/CreateStoreScheduleService';

class CreateStoreScheduleController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { 
            store_id, 
            day_of_week, 
            is_closed, 
            opening_time, 
            closing_time, 
            lunch_break_start, 
            lunch_break_end 
        } = req.body;

        const createStoreScheduleService = new CreateStoreScheduleService();

        const schedule = await createStoreScheduleService.execute({
            store_id,
            day_of_week,
            is_closed,
            opening_time,
            closing_time,
            lunch_break_start,
            lunch_break_end,
        });
        
        return res.json(schedule);
    }
}

export { CreateStoreScheduleController };
