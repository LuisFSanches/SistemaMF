import { Request, Response, NextFunction } from 'express'
import { GetAllProductService } from '../../services/product/GetAllProductService';
import { BadRequestException } from '../../exceptions/bad-request';

class GetAllProductController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const getAllProductService = new GetAllProductService();
		const products = await getAllProductService.execute();

		if ('error' in products && products.error) {
			next(new BadRequestException(
				products.message,
				products.code
			));

			return;
		}

		return res.json(products);
	}
}

export { GetAllProductController }