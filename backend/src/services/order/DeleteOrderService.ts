import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class DeleteOrderService{
	async execute(id: string) {
		try {
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
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { DeleteOrderService }
