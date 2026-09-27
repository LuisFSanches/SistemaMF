import { Request, Response, NextFunction } from "express";
import { DeleteWhatsAppTemplateService } from "../../services/whatsappTemplate/DeleteWhatsAppTemplateService";

class DeleteWhatsAppTemplateController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteWhatsAppTemplateService = new DeleteWhatsAppTemplateService();

        const result = await deleteWhatsAppTemplateService.execute(id);

        return res.json(result);
    }
}

export { DeleteWhatsAppTemplateController };
