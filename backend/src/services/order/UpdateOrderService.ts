import moment from 'moment-timezone';
import prismaClient from '../../prisma';
import { IOrder } from "../../interfaces/IOrder";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateOrderService{
	async execute(data: IOrder) {
		const order = {
			...data
		}

		delete order.products;

		try {
			const formattedDeliveryDate = moment.utc(order.delivery_date)
				.tz('America/Sao_Paulo', true)
				.set({ hour: 12, minute: 0, second: 0 })
				.toDate();

			const updatedOrder = await prismaClient.order.update({
				where: {
					id: data.id
				},
				data: {
					...order,
					delivery_date: formattedDeliveryDate,
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
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { UpdateOrderService }
