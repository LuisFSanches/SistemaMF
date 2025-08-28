import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

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
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { UpdateOrderStatusService }
