import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '../../exceptions/bad-request';
import { ErrorCodes } from '../../exceptions/root';
import { CreateOrReplaceProduct3DModelService } from '../../services/product3dModel/CreateOrReplaceProduct3DModelService';

class ReplaceProduct3DModelController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            throw new BadRequestException('No model file provided', ErrorCodes.VALIDATION_ERROR);
        }

        const createOrReplaceProduct3DModelService = new CreateOrReplaceProduct3DModelService();

        const model = await createOrReplaceProduct3DModelService.execute({
            product_id: id,
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mode: 'replace',
        });

        return res.json(model);
    }
}

export { ReplaceProduct3DModelController };
