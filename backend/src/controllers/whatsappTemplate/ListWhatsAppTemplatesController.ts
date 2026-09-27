import { Request, Response, NextFunction } from "express";
import { ListWhatsAppTemplatesService } from "../../services/whatsappTemplate/ListWhatsAppTemplatesService";

class ListWhatsAppTemplatesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const listWhatsAppTemplatesService = new ListWhatsAppTemplatesService();

        const result = await listWhatsAppTemplatesService.execute();

        return res.json(result);
    }
}

export { ListWhatsAppTemplatesController };
