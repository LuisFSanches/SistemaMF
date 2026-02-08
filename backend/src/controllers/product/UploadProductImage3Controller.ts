import { Request, Response, NextFunction } from 'express';
import { UploadProductImage3Service } from '../../services/product/UploadProductImage3Service';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class UploadProductImage3Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException(
                'No image file provided',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const uploadProductImage3Service = new UploadProductImage3Service();

        const product = await uploadProductImage3Service.execute({
            product_id: id,
            filename: req.file.filename
        });

        return res.json(product);
    }
}

export { UploadProductImage3Controller };
