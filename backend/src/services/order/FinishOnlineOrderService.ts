import prismaClient from '../../prisma';
import moment from 'moment-timezone';
import { IOnlineOrder } from "../../interfaces/IOnlineOrder";
import { ErrorCodes } from "../../exceptions/root";

class FinishOnlineOrderService{
	async execute(data: IOnlineOrder) {
		try {
			const formattedDeliveryDate = moment.utc(data.delivery_date)
				.tz('America/Sao_Paulo', true)
				.set({ hour: 12, minute: 0, second: 0 })
				.toDate();

			const formattedData = {
				...data,
				delivery_date: formattedDeliveryDate
			}

			const updatedOrder = await prismaClient.order.update({
				where: {
					id: data.id,
                    online_code: data.online_code
				},
				data: formattedData,
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
