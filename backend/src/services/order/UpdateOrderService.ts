import prismaClient from '../../prisma';
import { IOrder } from "../../interfaces/IOrder";
import { ErrorCodes } from "../../exceptions/root";

class UpdateOrderService{
	async execute(data: IOrder) {
		try {
			const updatedOrder = await prismaClient.order.update({
				where: {
					id: data.id
				},
				data,
				include: {
					client: true,
					clientAddress: true
				}
			})

			return updatedOrder;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { UpdateOrderService }
