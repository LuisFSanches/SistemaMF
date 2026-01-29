import { Request, Response, NextFunction } from 'express'
import { GetStoreFrontProductsService } from '../../services/product/GetStoreFrontProductsService';

class GetStoreFrontProductsController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { slug } = req.params;
		const { page = '1', pageSize = '10', query = '', categorySlug = '' } = req.query;
		console.log('query', query)
		
		const getStoreFrontProductsService = new GetStoreFrontProductsService();
		const result = await getStoreFrontProductsService.execute(
			slug,
			Number(page),
            Number(pageSize),
            String(query),
			String(categorySlug)
		);

		return res.json(result);
	}
}

export { GetStoreFrontProductsController }
