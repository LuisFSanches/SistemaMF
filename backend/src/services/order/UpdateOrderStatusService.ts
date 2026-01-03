import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IOrderStatus {
	id: string;
	status: string;
	store_id?: string;
}

class UpdateOrderStatusService{
	async execute({ id, status, store_id }: IOrderStatus) {
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
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { UpdateOrderStatusService }
