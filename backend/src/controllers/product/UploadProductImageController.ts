import { Request, Response, NextFunction } from 'express';
import { UploadProductImageService } from '../../services/product/UploadProductImageService';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';

class UploadProductImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException(
                'No image file provided',
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const uploadProductImageService = new UploadProductImageService();

        const product = await uploadProductImageService.execute({
            product_id: id,
            filename: req.file.filename
        });

        return res.json(product);
    }
}

export { UploadProductImageController };
