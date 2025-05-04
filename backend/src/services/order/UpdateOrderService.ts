import prismaClient from '../../prisma';
import { IOrder } from "../../interfaces/IOrder";
import { ErrorCodes } from "../../exceptions/root";

class UpdateOrderService{
	async execute(data: IOrder) {
		const order = {
			...data
		}

		delete order.products;

		try {
			const updatedOrder = await prismaClient.order.update({
				where: {
					id: data.id
				},
				data: {
					...order,
					orderItems: {
						update: data.products
						.filter((product: any) => product.id)
						.map((product: any) => ({
							where: {
								id: product.id,
							},
							data: {
								product_id: product.product_id,
								quantity: Number(product.quantity),
								price: Number(product.price),
							},
						})),
						create: data.products
						.filter((product: any) => !product.id)
						.map((product: any) => ({
							product_id: product.product_id,
							quantity: Number(product.quantity),
							price: Number(product.price),
						})),
					},
				},
				include: {
					client: true,
					clientAddress: true,
					createdBy: true,
					orderItems: {
						include: {
							product: true
						}
					}
				}
			})

			return updatedOrder;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { UpdateOrderService }
