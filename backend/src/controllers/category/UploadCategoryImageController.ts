import { Request, Response, NextFunction } from 'express';
import { UploadCategoryImageService } from '../../services/category/UploadCategoryImageService';

class UploadCategoryImageController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadCategoryImageService = new UploadCategoryImageService();

        const category = await uploadCategoryImageService.execute({
            category_id: id,
            filename: req.file.filename,
        });

        return res.json(category);
    }
}

export { UploadCategoryImageController };
