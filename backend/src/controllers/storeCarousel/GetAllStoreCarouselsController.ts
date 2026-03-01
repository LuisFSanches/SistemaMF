import { Request, Response, NextFunction } from 'express';
import { GetAllStoreCarouselsService } from '../../services/storeCarousel/GetAllStoreCarouselsService';

class GetAllStoreCarouselsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id } = req.query;

        if (!store_id || typeof store_id !== 'string') {
            return res.status(400).json({ error: "store_id is required" });
        }

        const getAllStoreCarouselsService = new GetAllStoreCarouselsService();

        const result = await getAllStoreCarouselsService.execute({ store_id });

        return res.json(result);
    }
}

export { GetAllStoreCarouselsController };
