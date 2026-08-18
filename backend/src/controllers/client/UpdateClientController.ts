import {Request, Response, NextFunction} from 'express';
import { UpdateClientService } from '../../services/client/UpdateClientService';

class UpdateClientController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { id, first_name, last_name, phone_number, country_code } = req.body;

		const updateClientService = new UpdateClientService();

		const client = await updateClientService.execute({
			id,
			first_name,
			last_name,
			phone_number,
			country_code
		});

		return res.json(client)
	}
}

export { UpdateClientController }