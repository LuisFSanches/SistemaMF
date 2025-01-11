import { Request, Response } from "express";
import { TopClientsService } from "../../services/statistics/TopClientsService";

class TopClientsController {
	async handle(req: Request, res: Response) {
		const { initial_date, final_date, limit } = req.query;

		const topClientsService = new TopClientsService();

		const clients = await topClientsService.execute(initial_date, final_date, limit);

		return res.json(clients);
	}
}

export { TopClientsController };
