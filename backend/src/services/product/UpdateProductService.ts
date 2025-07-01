import { IProduct } from "../../interfaces/IProduct";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class UpdateProductService{
	async execute({ id, name, price, unity, stock, enabled, image }: IProduct) {	
        console.log('id', id)	
		try {
			let data = {
				name,
				price,
				unity,
                stock,
                enabled,
				image
			} as any;
			
			const updatedProduct =await prismaClient.product.update({
				where: {
					id: id
				},
				data: data
			})

			return updatedProduct;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { UpdateProductService }
