import { Request, Response, NextFunction } from 'express';
import { SyncStoreProductImageToGlobalService } from '../../services/storeProduct/SyncStoreProductImageToGlobalService';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class SyncStoreProductImageToGlobalController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { image_field } = req.body;

        if (!image_field) {
            throw new BadRequestException(
                'image_field is required in request body',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        if (!['image', 'image_2', 'image_3'].includes(image_field)) {
            throw new BadRequestException(
                'image_field must be one of: image, image_2, image_3',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const syncStoreProductImageToGlobalService = new SyncStoreProductImageToGlobalService();

        const result = await syncStoreProductImageToGlobalService.execute({
            store_product_id: id,
            image_field: image_field as 'image' | 'image_2' | 'image_3'
        });

        return res.json(result);
    }
}

export { SyncStoreProductImageToGlobalController };
