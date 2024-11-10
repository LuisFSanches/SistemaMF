import { IOrder } from "../../interfaces/IOrder";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class CreateOrderService{
	async execute({
		description,
		additional_information,
		client_id,
		client_address_id,
		products_value,
		delivery_fee,
		total,
		created_by,
		updated_by,
		status,
		has_card
	}: IOrder) {

		try {
			const order = await prismaClient.order.create({
				data: {
					description,
					additional_information,
					client_id,
					client_address_id,
					products_value,
					delivery_fee,
					total,
					created_by,
					updated_by,
					status,
					has_card
				}
		})

		return order;

		} catch(error: any) {
			console.log('error', error)
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { CreateOrderService }
