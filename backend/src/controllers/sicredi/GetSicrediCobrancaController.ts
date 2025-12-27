import { Request, Response } from 'express';
import { GetSicrediAuthService } from '../../services/pix/GetSicrediAuthService';
import { GetSicrediCobrancaService } from '../../services/pix/GetSicrediCobrancaService';
import { getSicrediCertificates } from '../../utils/getCertificates';

class GetSicrediCobrancaController {
    async handle(req: Request, res: Response) {
        const { txid } = req.params;

        const httpsAgent = getSicrediCertificates();

        const getSicrediAuthService = new GetSicrediAuthService();
        const getSicrediCobrancaService = new GetSicrediCobrancaService();

        const accessToken = await getSicrediAuthService.execute({ httpsAgent });

        if (!accessToken) {
            throw new Error("Falha ao obter o token de acesso do Sicredi.");
        }

        const cobranca = await getSicrediCobrancaService.execute(
            accessToken,
            httpsAgent,
            txid
        );

        return res.json(cobranca);
    }
}

export { GetSicrediCobrancaController };
