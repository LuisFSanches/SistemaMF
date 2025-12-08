import { Request, Response } from 'express';
import { GetSicrediAuthService } from '../../services/pix/GetSicrediAuthService';
import { DeleteSicrediWebhookService } from '../../services/pix/DeleteSicrediWebhookService';
import { getSicrediCertificates } from '../../utils/getCertificates';

class DeleteSicrediWebhookController {
    async handle(req: Request, res: Response) {
        const { chave } = req.params;

        const httpsAgent = getSicrediCertificates();

        const getSicrediAuthService = new GetSicrediAuthService();
        const deleteSicrediWebhookService = new DeleteSicrediWebhookService();

        const accessToken = await getSicrediAuthService.execute({ httpsAgent });

        if (!accessToken) {
            throw new Error("Falha ao obter o token de acesso do Sicredi.");
        }

        const result = await deleteSicrediWebhookService.execute(
            accessToken,
            httpsAgent,
            chave
        );

        return res.json(result);
    }
}

export { DeleteSicrediWebhookController };
