import { Request, Response, NextFunction } from 'express';
import { GetAllStoreHolidaysService } from '../../services/storeHoliday/GetAllStoreHolidaysService';

class GetAllStoreHolidaysController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id } = req.params;

        const getAllStoreHolidaysService = new GetAllStoreHolidaysService();

        const holidays = await getAllStoreHolidaysService.execute({ store_id });
        
        return res.json(holidays);
    }
}

export { GetAllStoreHolidaysController };
