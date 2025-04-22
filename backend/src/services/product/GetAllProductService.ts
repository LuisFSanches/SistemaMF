import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAllProductService{
	async execute() {
		try {
			const products = await prismaClient.product.findMany({
				select: {
					id: true,
					name: true,
					price: true,
					unity: true,
                    stock: true,
                    enabled: true
				},
                orderBy: {
                    created_at: 'desc'
                }
			});

			return { products };

			} catch(error: any) {
				return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
			}
		}
	}

export { GetAllProductService }