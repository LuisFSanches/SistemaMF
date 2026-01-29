import { Request, Response, NextFunction } from 'express';
import { CreateStoreHolidayService } from '../../services/storeHoliday/CreateStoreHolidayService';

class CreateStoreHolidayController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { 
            store_id, 
            date, 
            name, 
            description, 
            is_closed 
        } = req.body;

        const createStoreHolidayService = new CreateStoreHolidayService();

        const holiday = await createStoreHolidayService.execute({
            store_id,
            date,
            name,
            description,
            is_closed,
        });
        
        return res.json(holiday);
    }
}

export { CreateStoreHolidayController };
