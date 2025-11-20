import moment from 'moment-timezone';
import { IOrder } from "../../interfaces/IOrder";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateOrderService{
	async execute(data: IOrder, products: any) {
		const { delivery_date } = data;
				
		try {
			const formattedDeliveryDate = moment.utc(delivery_date)
				.tz('America/Sao_Paulo', true)
				.set({ hour: 12, minute: 0, second: 0 })
				.toDate();

			const order = await prismaClient.order.create({
				data: {
					...data,
					delivery_date: formattedDeliveryDate,
					orderItems: {
						create: products.map((product: any) => ({
							product_id: product.id,
							quantity: Number(product.quantity),
							price: Number(product.price),
						})),
					},
				},

				include: {
					client: true,
          			clientAddress: true
				}
		})

		return order;

		} catch(error: any) {
			console.error("[CreateOrderService] Failed:", error);
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { CreateOrderService }
