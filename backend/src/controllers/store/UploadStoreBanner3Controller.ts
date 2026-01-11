import { Request, Response, NextFunction } from 'express';
import { UploadStoreBanner3Service } from '../../services/store/UploadStoreBanner3Service';

class UploadStoreBanner3Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreBanner3Service = new UploadStoreBanner3Service();

        const store = await uploadStoreBanner3Service.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreBanner3Controller };
