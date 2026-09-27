import { Request, Response, NextFunction } from 'express';
import { UploadWhatsAppTemplateHeaderService } from '../../services/whatsappTemplate/UploadWhatsAppTemplateHeaderService';

class UploadWhatsAppTemplateHeaderController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadWhatsAppTemplateHeaderService = new UploadWhatsAppTemplateHeaderService();

        const template = await uploadWhatsAppTemplateHeaderService.execute({
            template_id: id,
            filename: req.file.filename,
        });

        return res.json({ template });
    }
}

export { UploadWhatsAppTemplateHeaderController };
