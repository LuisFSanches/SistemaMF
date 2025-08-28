import { Request, Response, NextFunction } from 'express'
import { GetAllProductService } from '../../services/product/GetAllProductService';
import { BadRequestException } from '../../exceptions/bad-request';

class GetAllProductController{
	async handle(req: Request, res: Response, next: NextFunction) {
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