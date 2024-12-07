import {Request, Response} from 'express'
import { GetPixService } from '../../services/pix/GetPixService'
import { GetInterAuthService } from '../../services/pix/GetInterAuthService';
import { getCertificates } from '../../utils/getCertificates';

class GetPixController {
	async handle(req: Request, res: Response) {
		const { initial_date, final_date, limit } = req.query;

		const httpsAgent = getCertificates();

		const getInterAuthService = new GetInterAuthService();
		const getPixService = new GetPixService();

		const accessToken = await getInterAuthService.execute({ httpsAgent });

		const pix = await getPixService.execute(accessToken, httpsAgent, initial_date, final_date, limit);

		return res.json(pix);
	}
}

export { GetPixController }
