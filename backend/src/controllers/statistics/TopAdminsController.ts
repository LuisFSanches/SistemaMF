import { Request, Response } from "express";
import { TopAdminsService } from "../../services/statistics/TopAdminsService";

class TopAdminsController {
	async handle(req: Request, res: Response) {
		const topAdminsService = new TopAdminsService();

		const admins = await topAdminsService.execute();

		return res.json(admins);
	}
}

export { TopAdminsController };
