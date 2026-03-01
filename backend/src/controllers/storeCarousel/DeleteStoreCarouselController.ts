import { Request, Response, NextFunction } from 'express';
import { DeleteStoreCarouselService } from '../../services/storeCarousel/DeleteStoreCarouselService';

class DeleteStoreCarouselController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteStoreCarouselService = new DeleteStoreCarouselService();

        const result = await deleteStoreCarouselService.execute({ id });

        return res.json(result);
    }
}

export { DeleteStoreCarouselController };
