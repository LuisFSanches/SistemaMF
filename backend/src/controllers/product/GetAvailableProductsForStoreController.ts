import { Request, Response, NextFunction } from 'express'
import { GetAvailableProductsForStoreService } from '../../services/product/GetAvailableProductsForStoreService';

class GetAvailableProductsForStoreController {
	async handle(req: Request, res: Response, next: NextFunction) {
		const { page = '1', pageSize = '10', query = '' } = req.query;
		const store_id = req.admin?.store_id;

		if (!store_id) {
			return res.status(400).json({ error: "Store ID not found in session" });
		}

		const getAvailableProductsForStoreService = new GetAvailableProductsForStoreService();
		const products = await getAvailableProductsForStoreService.execute(
			store_id,
			Number(page),
			Number(pageSize),
			String(query)
		);

		return res.json(products);
	}
}

export { GetAvailableProductsForStoreController }
