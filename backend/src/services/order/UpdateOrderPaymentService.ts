import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IOrderPayment {
	id: string;
	payment_received: boolean;
}

class UpdateOrderPaymentService {
	async execute({ id, payment_received }: IOrderPayment) {
		try {
			// Verificar se a ordem existe
			const orderExists = await prismaClient.order.findUnique({
				where: { id }
			});

			if (!orderExists) {
				throw new BadRequestException(
					"Order not found",
					ErrorCodes.USER_NOT_FOUND
				);
			}

			// Atualizar o status de pagamento
			const updateOrder = await prismaClient.order.update({
				where: {
					id: id
				},
				data: {
					payment_received
				},
				include: {
					client: true,
					clientAddress: true
				}
			});

			return updateOrder;

		} catch(error: any) {
			console.error("[UpdateOrderPaymentService] Failed:", error);

			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { UpdateOrderPaymentService };
