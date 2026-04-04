import { Request, Response, NextFunction } from 'express';
import { UploadStoreProductImage3Service } from '../../services/storeProduct/UploadStoreProductImage3Service';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class UploadStoreProductImage3Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException(
                'No image file provided',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const uploadStoreProductImage3Service = new UploadStoreProductImage3Service();

        const storeProduct = await uploadStoreProductImage3Service.execute({
            store_product_id: id,
            filename: req.file.filename
        });

        return res.json(storeProduct);
    }
}

export { UploadStoreProductImage3Controller };
