import { Request, Response, NextFunction } from 'express';
import { UpdateStoreSchedulesService } from '../../services/store/UpdateStoreSchedulesService';

class UpdateStoreSchedulesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { schedules } = req.body;

        const updateStoreSchedulesService = new UpdateStoreSchedulesService();

        const result = await updateStoreSchedulesService.execute({
            store_id: id,
            schedules,
        });

        return res.json(result);
    }
}

export { UpdateStoreSchedulesController };
