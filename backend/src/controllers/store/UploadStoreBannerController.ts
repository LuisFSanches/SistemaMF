import { Request, Response, NextFunction } from 'express';
import { UploadStoreBannerService } from '../../services/store/UploadStoreBannerService';

class UploadStoreBannerController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreBannerService = new UploadStoreBannerService();

        const store = await uploadStoreBannerService.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreBannerController };
