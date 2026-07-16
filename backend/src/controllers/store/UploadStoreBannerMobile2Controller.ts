import { Request, Response, NextFunction } from 'express';
import { UploadStoreBannerMobile2Service } from '../../services/store/UploadStoreBannerMobile2Service';

class UploadStoreBannerMobile2Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreBannerMobile2Service = new UploadStoreBannerMobile2Service();

        const store = await uploadStoreBannerMobile2Service.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreBannerMobile2Controller };
