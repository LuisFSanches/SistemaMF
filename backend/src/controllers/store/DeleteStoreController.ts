import { Request, Response, NextFunction } from 'express';
import { DeleteStoreService } from '../../services/store/DeleteStoreService';

class DeleteStoreController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteStoreService = new DeleteStoreService();

        const result = await deleteStoreService.execute({ id });

        return res.json(result);
    }
}

export { DeleteStoreController };
