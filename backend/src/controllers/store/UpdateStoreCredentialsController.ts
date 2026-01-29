import { Request, Response, NextFunction } from 'express';
import { UpdateStoreCredentialsService } from '../../services/store/UpdateStoreCredentialsService';

class UpdateStoreCredentialsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const credentials = req.body;

        const updateStoreCredentialsService = new UpdateStoreCredentialsService();

        const result = await updateStoreCredentialsService.execute({
            store_id: id,
            ...credentials,
        });

        return res.json(result);
    }
}

export { UpdateStoreCredentialsController };
