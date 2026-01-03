import { Request, Response, NextFunction } from 'express';
import { UpdateStoreHolidayService } from '../../services/storeHoliday/UpdateStoreHolidayService';

class UpdateStoreHolidayController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const data = req.body;

        const updateStoreHolidayService = new UpdateStoreHolidayService();

        const holiday = await updateStoreHolidayService.execute({
            id,
            ...data,
        });
        
        return res.json(holiday);
    }
}

export { UpdateStoreHolidayController };
