import { Request, Response, NextFunction } from 'express';
import { UploadStoreProductImageService } from '../../services/storeProduct/UploadStoreProductImageService';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class UploadStoreProductImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException(
                'No image file provided',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const uploadStoreProductImageService = new UploadStoreProductImageService();

        const storeProduct = await uploadStoreProductImageService.execute({
            store_product_id: id,
            filename: req.file.filename
        });

        return res.json(storeProduct);
    }
}

export { UploadStoreProductImageController };
