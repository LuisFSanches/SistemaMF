import { Request, Response } from "express";
import { DailySalesService } from "../../services/statistics/DailySalesService";

class DailySalesController {
	async handle(req: Request, res: Response) {
		const { initial_date, final_date } = req.query;

		const dailySalesService = new DailySalesService();

		const sales = await dailySalesService.execute(initial_date, final_date);

		return res.json(sales);
	}
}

export { DailySalesController };
