import { Request, Response, NextFunction } from 'express';
import { UpdateStoreService } from '../../services/store/UpdateStoreService';

class UpdateStoreController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const updateData = req.body;

        const updateStoreService = new UpdateStoreService();

        const store = await updateStoreService.execute({
            id,
            ...updateData,
        });

        return res.json(store);
    }
}

export { UpdateStoreController };
