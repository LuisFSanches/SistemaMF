import { Request, Response } from 'express';
import { GetSicrediAuthService } from '../../services/pix/GetSicrediAuthService';
import { CreateSicrediCobrancaService } from '../../services/pix/CreateSicrediCobrancaService';
import { getSicrediCertificates } from '../../utils/getCertificates';

class CreateSicrediCobrancaController {
    async handle(req: Request, res: Response) {
        const cobrancaData = req.body;

        const httpsAgent = getSicrediCertificates();

        const getSicrediAuthService = new GetSicrediAuthService();
        const createSicrediCobrancaService = new CreateSicrediCobrancaService();

        const accessToken = await getSicrediAuthService.execute({ httpsAgent });

        if (!accessToken) {
            throw new Error("Falha ao obter o token de acesso do Sicredi.");
        }

        const cobranca = await createSicrediCobrancaService.execute(
            accessToken,
            httpsAgent,
            cobrancaData
        );

        return res.json(cobranca);
    }
}

export { CreateSicrediCobrancaController };
