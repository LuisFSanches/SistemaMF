import prismaClient from '../../prisma';
import { IOrder } from "../../interfaces/IOrder";
import { ErrorCodes } from "../../exceptions/root";

interface IOrderStatus {
	id: string;
	status: string;
}

class UpdateOrderStatusService{
	async execute({ id, status }: IOrderStatus) {
		try {
			const updateOrder = await prismaClient.order.update({
				where: {
					id: id
				},
				data: {
					status
				},
				include: {
					client: true,
          			clientAddress: true
				}
			})

			return updateOrder;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { UpdateOrderStatusService }
