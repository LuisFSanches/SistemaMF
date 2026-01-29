import prismaClient from '../../prisma';
import moment from 'moment-timezone';
import { IOnlineOrder } from "../../interfaces/IOnlineOrder";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class FinishOnlineOrderService{
	async execute(data: IOnlineOrder, store_id?: string) {
		try {
			// Verificar se a ordem existe e pertence à loja
			const whereClause: any = {
				id: data.id,
				online_code: data.online_code
			};
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
			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { FinishOnlineOrderService }
