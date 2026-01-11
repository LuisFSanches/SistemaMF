import { Request, Response, NextFunction } from 'express';
import { GetAllStoresService } from '../../services/store/GetAllStoresService';

class GetAllStoresController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const getAllStoresService = new GetAllStoresService();

        const stores = await getAllStoresService.execute();

        return res.json(stores);
    }
}

export { GetAllStoresController };
