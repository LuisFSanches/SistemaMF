import { Request, Response, NextFunction } from 'express'
import { GetStoreFrontProductsService } from '../../services/product/GetStoreFrontProductsService';

class GetStoreFrontProductsController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { page = '1', pageSize = '10', query = '' } = req.query;
		const getStoreFrontProductsService = new GetStoreFrontProductsService();
		const products = await getStoreFrontProductsService.execute(
			Number(page),
            Number(pageSize),
            String(query)
		);

		return res.json(products);
	}
}

export { GetStoreFrontProductsController }
