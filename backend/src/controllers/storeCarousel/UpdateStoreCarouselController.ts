import { Request, Response, NextFunction } from 'express';
import { UpdateStoreCarouselService } from '../../services/storeCarousel/UpdateStoreCarouselService';

class UpdateStoreCarouselController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, is_active, product_ids } = req.body;

        const updateStoreCarouselService = new UpdateStoreCarouselService();

        const result = await updateStoreCarouselService.execute({
            id,
            name,
            is_active,
            product_ids,
        });

        return res.json(result);
    }
}

export { UpdateStoreCarouselController };
