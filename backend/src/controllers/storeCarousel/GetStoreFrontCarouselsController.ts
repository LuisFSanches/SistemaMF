import { Request, Response, NextFunction } from 'express';
import { GetStoreFrontCarouselsService } from '../../services/storeCarousel/GetStoreFrontCarouselsService';

class GetStoreFrontCarouselsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { slug } = req.params;

        const getStoreFrontCarouselsService = new GetStoreFrontCarouselsService();

        const result = await getStoreFrontCarouselsService.execute({ slug });

        return res.json(result);
    }
}

export { GetStoreFrontCarouselsController };
