import { Request, Response, NextFunction } from 'express'
import { GetAllProductService } from '../../services/product/GetAllProductService';

class GetAllProductController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { page = '1', pageSize = '10', query = '' } = req.query;
		const store_id = req.admin?.store_id || undefined;
		const getAllProductService = new GetAllProductService();
		const products = await getAllProductService.execute(
			Number(page),
            Number(pageSize),
            String(query),
            store_id
		);

		return res.json(products);
	}
}

export { GetAllProductController }