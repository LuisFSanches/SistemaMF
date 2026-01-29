import { Request, Response, NextFunction } from 'express';
import { GetStoreHolidayService } from '../../services/storeHoliday/GetStoreHolidayService';

class GetStoreHolidayController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getStoreHolidayService = new GetStoreHolidayService();

        const holiday = await getStoreHolidayService.execute({ id });
        
        return res.json(holiday);
    }
}

export { GetStoreHolidayController };
