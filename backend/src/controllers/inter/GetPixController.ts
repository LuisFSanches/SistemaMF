import {Request, Response} from 'express'
import { GetPixService } from '../../services/pix/GetPixService'
import { GetInterAuthService } from '../../services/pix/GetInterAuthService';
import { getCertificates } from '../../utils/getCertificates';

class GetPixController {
	async handle(req: Request, res: Response) {
		const { initial_date, final_date, limit } = req.query;
		const store_id = req.admin?.store_id as string;

		const httpsAgent = await getCertificates(store_id);

		const getInterAuthService = new GetInterAuthService();
		const getPixService = new GetPixService();

		const accessToken = await getInterAuthService.execute({ httpsAgent, store_id });

		if (!accessToken) {
			throw new Error("Falha ao obter o token de acesso do Banco Inter.");
		}		

		const pix = await getPixService.execute(accessToken, httpsAgent, initial_date, final_date, limit);

		return res.json(pix);
	}
}

export { GetPixController }
