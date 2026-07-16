import { Request, Response, NextFunction } from 'express';
import { UploadStoreBannerMobileService } from '../../services/store/UploadStoreBannerMobileService';

class UploadStoreBannerMobileController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreBannerMobileService = new UploadStoreBannerMobileService();

        const store = await uploadStoreBannerMobileService.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreBannerMobileController };
