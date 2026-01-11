import { Request, Response, NextFunction } from 'express';
import { UploadStoreLogoService } from '../../services/store/UploadStoreLogoService';

class UploadStoreLogoController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadStoreLogoService = new UploadStoreLogoService();

        const store = await uploadStoreLogoService.execute({
            store_id: id,
            filename: req.file.filename,
        });

        return res.json(store);
    }
}

export { UploadStoreLogoController };
