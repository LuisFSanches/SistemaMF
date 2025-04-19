import prismaClient from '../../prisma';
import { IOnlineOrder } from "../../interfaces/IOnlineOrder";
import { ErrorCodes } from "../../exceptions/root";

class FinishOnlineOrderService{
	async execute(data: IOnlineOrder) {
		try {
			const updatedOrder = await prismaClient.order.update({
				where: {
					id: data.id,
                    online_code: data.online_code
				},
				data,
				include: {
					client: true,
					clientAddress: true
				}
			})

			return updatedOrder;

		} catch(error: any) {
            console.log('Failed when finishing online order', error.message)
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { FinishOnlineOrderService }
