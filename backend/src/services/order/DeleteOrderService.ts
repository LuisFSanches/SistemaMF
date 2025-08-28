import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

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
			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { DeleteOrderService }
