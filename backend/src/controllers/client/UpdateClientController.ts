import {Request, Response, NextFunction} from 'express';
import { UpdateClientService } from '../../services/client/UpdateClientService';
import { BadRequestException } from '../../exceptions/bad-request';

class UpdateClientController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { id, first_name, last_name, phone_number } = req.body;

		const updateClientService = new UpdateClientService();

		const client = await updateClientService.execute({
			id,
			first_name,
			last_name,
			phone_number
		});

		if ('error' in client && client.error) {
			next(new BadRequestException(
				client.message,
				client.code
			));

			return;
		}

		return res.json(client)
	}
}

export { UpdateClientController }