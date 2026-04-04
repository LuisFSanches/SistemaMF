import { Request, Response, NextFunction } from 'express';
import { UploadStoreProductImage2Service } from '../../services/storeProduct/UploadStoreProductImage2Service';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class UploadStoreProductImage2Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException(
                'No image file provided',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const uploadStoreProductImage2Service = new UploadStoreProductImage2Service();

        const storeProduct = await uploadStoreProductImage2Service.execute({
            store_product_id: id,
            filename: req.file.filename
        });

        return res.json(storeProduct);
    }
}

export { UploadStoreProductImage2Controller };
