import { Request, Response, NextFunction } from 'express';
import { UploadStoreBannerMobile3Service } from '../../services/store/UploadStoreBannerMobile3Service';

class UploadStoreBannerMobile3Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreBannerMobile3Service = new UploadStoreBannerMobile3Service();

        const store = await uploadStoreBannerMobile3Service.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreBannerMobile3Controller };
