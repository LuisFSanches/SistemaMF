import { Request, Response, NextFunction } from "express";
import { CreateWhatsAppTemplateService } from "../../services/whatsappTemplate/CreateWhatsAppTemplateService";

class CreateWhatsAppTemplateController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name, language_code, variable_types, header_type, header_media_url } = req.body;

        const createWhatsAppTemplateService = new CreateWhatsAppTemplateService();

        const template = await createWhatsAppTemplateService.execute({
            name,
            language_code,
            variable_types,
            header_type,
            header_media_url,
        });

        return res.json({ template });
    }
}

export { CreateWhatsAppTemplateController };
