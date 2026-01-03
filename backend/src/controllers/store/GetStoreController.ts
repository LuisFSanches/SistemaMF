import { Request, Response, NextFunction } from 'express';
import { GetStoreService } from '../../services/store/GetStoreService';

class GetStoreController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { slug } = req.query;

        const getStoreService = new GetStoreService();

        const store = await getStoreService.execute({
            id,
            slug: slug as string,
        });

        return res.json(store);
    }
}

export { GetStoreController };
