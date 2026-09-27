import { Request, Response, NextFunction } from "express";
import { UpdateWhatsAppTemplateService } from "../../services/whatsappTemplate/UpdateWhatsAppTemplateService";

class UpdateWhatsAppTemplateController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, language_code, variable_types, header_type, header_media_url } = req.body;

        const updateWhatsAppTemplateService = new UpdateWhatsAppTemplateService();

        const template = await updateWhatsAppTemplateService.execute(id, {
            name,
            language_code,
            variable_types,
            header_type,
            header_media_url,
        });

        return res.json({ template });
    }
}

export { UpdateWhatsAppTemplateController };
