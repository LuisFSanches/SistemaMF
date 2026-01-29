import { Request, Response, NextFunction } from 'express';
import { UploadProductImage2Service } from '../../services/product/UploadProductImage2Service';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class UploadProductImage2Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException(
                'No image file provided',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const uploadProductImage2Service = new UploadProductImage2Service();

        const product = await uploadProductImage2Service.execute({
            product_id: id,
            filename: req.file.filename
        });

        return res.json(product);
    }
}

export { UploadProductImage2Controller };
