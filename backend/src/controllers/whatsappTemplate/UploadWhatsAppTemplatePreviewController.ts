import { Request, Response, NextFunction } from 'express';
import { UploadWhatsAppTemplatePreviewService } from '../../services/whatsappTemplate/UploadWhatsAppTemplatePreviewService';

class UploadWhatsAppTemplatePreviewController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadWhatsAppTemplatePreviewService = new UploadWhatsAppTemplatePreviewService();

        const template = await uploadWhatsAppTemplatePreviewService.execute({
            template_id: id,
            filename: req.file.filename,
        });

        return res.json({ template });
    }
}

export { UploadWhatsAppTemplatePreviewController };
