import { IProduct } from "../../interfaces/IProduct";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from '../../exceptions/bad-request';

class UpdateProductService{
	async execute({ id, name, price, unity, stock, enabled, image, visible_in_store }: IProduct) {	
		try {
			let data = {
				name,
				price,
				unity,
                stock,
                enabled,
				image,
				visible_in_store
			} as any;
			
			const updatedProduct =await prismaClient.product.update({
				where: {
					id: id
				},
				data: data
			})

			return updatedProduct;

		} catch(error: any) {
			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { UpdateProductService }
