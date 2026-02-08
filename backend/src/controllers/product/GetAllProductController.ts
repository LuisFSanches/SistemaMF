import { Request, Response, NextFunction } from 'express'
import { GetAllProductService } from '../../services/product/GetAllProductService';

class GetAllProductController{
	async handle(req: Request, res: Response, next: NextFunction) {
		console.log("Entrou no GetAllProductController");
		const { page = '1', pageSize = '10', query = '' } = req.query;
		const getAllProductService = new GetAllProductService();
		const products = await getAllProductService.execute(
			Number(page),
            Number(pageSize),
            String(query)
		);

		return res.json(products);
	}
}

export { GetAllProductController }