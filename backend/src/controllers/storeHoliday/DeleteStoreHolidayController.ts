import { Request, Response, NextFunction } from 'express';
import { DeleteStoreHolidayService } from '../../services/storeHoliday/DeleteStoreHolidayService';

class DeleteStoreHolidayController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteStoreHolidayService = new DeleteStoreHolidayService();

        const result = await deleteStoreHolidayService.execute({ id });
        
        return res.json(result);
    }
}

export { DeleteStoreHolidayController };
