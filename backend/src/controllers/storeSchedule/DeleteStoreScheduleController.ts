import { Request, Response, NextFunction } from 'express';
import { DeleteStoreScheduleService } from '../../services/storeSchedule/DeleteStoreScheduleService';

class DeleteStoreScheduleController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteStoreScheduleService = new DeleteStoreScheduleService();

        const result = await deleteStoreScheduleService.execute({ id });
        
        return res.json(result);
    }
}

export { DeleteStoreScheduleController };
