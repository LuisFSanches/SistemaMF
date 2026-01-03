import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteOrderService{
	async execute(id: string, store_id?: string) {
		try {
			// Verificar se a ordem existe e pertence à loja
			const whereClause: any = { id };
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

			await prismaClient.orderItem.deleteMany({
				where: {
					order_id: id
				}
			})

			const deleteOrder = await prismaClient.order.delete({
				where: {
					id: id
				},
			})

			return deleteOrder;

		} catch(error: any) {
			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { DeleteOrderService }
