import { Request, Response, NextFunction } from 'express';
import { GetStoreCarouselService } from '../../services/storeCarousel/GetStoreCarouselService';

class GetStoreCarouselController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getStoreCarouselService = new GetStoreCarouselService();

        const result = await getStoreCarouselService.execute({ id });

        return res.json(result);
    }
}

export { GetStoreCarouselController };
