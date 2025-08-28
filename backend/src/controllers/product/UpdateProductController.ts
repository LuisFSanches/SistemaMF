import { Request, Response, NextFunction } from 'express';
import { UpdateProductService } from '../../services/product/UpdateProductService';

class UpdateProductController{
	async handle(req: Request, res: Response, next: NextFunction) {
        const { name, price, unity, stock, enabled, image } = req.body;
        const id = req.params.id

		const updateProductService = new UpdateProductService();

		const admin = await updateProductService.execute({
            id,
			name,
			price,
			unity,
			stock,
            enabled,
			image
		});

		return res.json(admin)
	}
}

export { UpdateProductController }
