import { Request, Response } from 'express';
import { GetSicrediAuthService } from '../../services/pix/GetSicrediAuthService';
import { GetSicrediWebhookService } from '../../services/pix/GetSicrediWebhookService';
import { getSicrediCertificates } from '../../utils/getCertificates';

class GetSicrediWebhookController {
    async handle(req: Request, res: Response) {
        const { chave } = req.params;

        const httpsAgent = getSicrediCertificates();

        const getSicrediAuthService = new GetSicrediAuthService();
        const getSicrediWebhookService = new GetSicrediWebhookService();

        const accessToken = await getSicrediAuthService.execute({ httpsAgent });

        if (!accessToken) {
            throw new Error("Falha ao obter o token de acesso do Sicredi.");
        }

        const webhook = await getSicrediWebhookService.execute(
            accessToken,
            httpsAgent,
            chave
        );

        return res.json(webhook);
    }
}

export { GetSicrediWebhookController };
