import { Request, Response, NextFunction } from 'express';
import { UploadStoreBanner2Service } from '../../services/store/UploadStoreBanner2Service';

class UploadStoreBanner2Controller {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreBanner2Service = new UploadStoreBanner2Service();

        const store = await uploadStoreBanner2Service.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreBanner2Controller };
