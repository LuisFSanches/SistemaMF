import moment from 'moment-timezone';
import prismaClient from '../../prisma';
import { IOrder } from "../../interfaces/IOrder";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateOrderService{
	async execute(data: IOrder, store_id?: string) {
		const order = {
			...data
		}

		delete order.products;

		try {
			// Verificar se a ordem existe e pertence à loja
			const whereClause: any = { id: data.id };
			if (store_id) {
				whereClause.store_id = store_id;
			}

			const orderExists = await prismaClient.order.findFirst({
				where: whereClause
			});

			if (!orderExists) {
				throw new BadRequestException(
					"Order not found",
					ErrorCodes.USER_NOT_FOUND
				);
			}

			const formattedDeliveryDate = moment.utc(order.delivery_date)
				.tz('America/Sao_Paulo', true)
				.set({ hour: 12, minute: 0, second: 0 })
				.toDate();

		// IDs dos produtos que foram enviados no payload
		const sentProductIds = data.products
			.filter((product: any) => product.id)
			.map((product: any) => product.id);

		const updatedOrder = await prismaClient.order.update({
			where: {
				id: data.id
			},
			data: {
				...order,
				delivery_date: formattedDeliveryDate,
				orderItems: {
					// Deletar itens que não estão mais no payload
					deleteMany: sentProductIds.length > 0 ? {
						order_id: data.id,
						id: {
							notIn: sentProductIds
						}
					} : {
						order_id: data.id
					},
					update: data.products
						.filter((product: any) => product.id)
						.map((product: any) => ({
							where: {
								id: product.id,
							},
							data: {
								store_product_id: product.store_product_id,
								quantity: Number(product.quantity),
								price: Number(product.price),
							},
						})),
					create: data.products
						.filter((product: any) => !product.id)
						.map((product: any) => ({
							store_product_id: product.store_product_id,
							quantity: Number(product.quantity),
							price: Number(product.price),
							store_id,
						})),
				},
			},
			include: {
				client: true,
				clientAddress: true,
				createdBy: true,
				orderItems: {
					include: {
						storeProduct: {
							include: {
								product: {
									select: {
										name: true,
										image: true
									}
								}
							}
						}
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
