import { IOrder } from "../../interfaces/IOrder";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class CreateOrderService{
	async execute({
		description,
		additional_information,
		client_id,
		client_address_id,
		pickup_on_store,
		receiver_name,
		receiver_phone,
		products_value,
		delivery_fee,
		total,
		payment_method,
		payment_received,
		delivery_date,
		created_by,
		updated_by,
		status,
		has_card,
		online_order,
		online_code
	}: IOrder) {
		try {
			const order = await prismaClient.order.create({
				data: {
					description,
					additional_information,
					client_id,
					client_address_id,
					pickup_on_store,
					receiver_name,
					receiver_phone,
					products_value,
					delivery_fee,
					total,
					payment_method,
					payment_received,
					delivery_date,
					created_by,
					updated_by,
					status,
					has_card,
					online_order,
					online_code
				},

				include: {
					client: true,
          			clientAddress: true
				}
		})

		return order;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { CreateOrderService }
