import { Request, Response } from 'express';
import { GetSicrediAuthService } from '../../services/pix/GetSicrediAuthService';
import { UpdateSicrediWebhookService } from '../../services/pix/UpdateSicrediWebhookService';
import { getSicrediCertificates } from '../../utils/getCertificates';

class UpdateSicrediWebhookController {
    async handle(req: Request, res: Response) {
        const { chave } = req.params;
        const { webhookUrl } = req.body;

        const httpsAgent = getSicrediCertificates();

        const getSicrediAuthService = new GetSicrediAuthService();
        const updateSicrediWebhookService = new UpdateSicrediWebhookService();

        const accessToken = await getSicrediAuthService.execute({ httpsAgent });

        if (!accessToken) {
            throw new Error("Falha ao obter o token de acesso do Sicredi.");
        }

        const webhook = await updateSicrediWebhookService.execute(
            accessToken,
            httpsAgent,
            chave,
            webhookUrl
        );

        return res.json(webhook);
    }
}

export { UpdateSicrediWebhookController };
