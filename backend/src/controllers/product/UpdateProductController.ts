import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from "../../exceptions/bad-request";
import { UpdateProductService } from '../../services/product/UpdateProductService';

class UpdateProductController{
	async handle(req: Request, res: Response, next: NextFunction) {
        const { name, price, unity, stock, enabled } = req.body;
        const id = req.params.id

		const updateProductService = new UpdateProductService();

		const admin = await updateProductService.execute({
            id,
			name,
			price,
			unity,
			stock,
            enabled
		});

		if ('error' in admin && admin.error) {
			next(new BadRequestException(
				admin.message,
				admin.code
			));
		}

		return res.json(admin)
	}
}

export { UpdateProductController }
