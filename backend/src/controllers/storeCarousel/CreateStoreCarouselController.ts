import { Request, Response, NextFunction } from 'express';
import { CreateStoreCarouselService } from '../../services/storeCarousel/CreateStoreCarouselService';

class CreateStoreCarouselController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id, name, is_active, product_ids } = req.body;

        const createStoreCarouselService = new CreateStoreCarouselService();

        const result = await createStoreCarouselService.execute({
            store_id,
            name,
            is_active,
            product_ids,
        });

        return res.json(result);
    }
}

export { CreateStoreCarouselController };
