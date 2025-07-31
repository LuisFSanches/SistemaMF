import {Request, Response, NextFunction} from 'express';
import { UpdateOrderService } from '../../services/order/UpdateOrderService';
import { UpdateAddressService } from '../../services/address/UpdateAddressService';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { BadRequestException } from '../../exceptions/bad-request';
import { EventEmitter } from "events";

const orderEmitter = new EventEmitter();

class UpdateOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { order } = req.body;
		let client_address_id = order.clientAddress.id;
		let is_delivery = order.is_delivery;

		if (order.editAddress) {
			const { clientAddress } = order;
			const updateAddressService = new UpdateAddressService();
			const createAddressService = new CreateAddressService();

			if (order.is_delivery === false) {
				const address = await createAddressService.execute({
					client_id: order.client_id,
					street: clientAddress.street,
					street_number: clientAddress.street_number,
					complement: clientAddress.complement,
					reference_point: clientAddress.reference_point,
					neighborhood: clientAddress.neighborhood,
					city: clientAddress.city,
					state: clientAddress.state,
					postal_code: clientAddress.postal_code,
					country: clientAddress.country
				});
				
				if ('error' in address && address.error) {
					next(new BadRequestException(
						address.message,
						address.code
					));
					
					return;
				}

				client_address_id = (address as { id: string }).id;
				is_delivery = true;
			}

			if (order.is_delivery === true) {
				const address = await updateAddressService.execute(clientAddress);
				
				if ('error' in address && address.error) {
					next(new BadRequestException(
						address.message,
						address.code
					));
					
					return;
				}
			}
		}

		delete order.editAddress;
		delete order.clientAddress;

		order.client_address_id = client_address_id;
		order.is_delivery = is_delivery;

		const updateOrderService = new UpdateOrderService();

		const data = await updateOrderService.execute(order);

		if ('error' in data && data.error) {
			next(new BadRequestException(
				data.message,
				data.code
			));

			return;
		}

		orderEmitter.emit("orderUpdated", { data });

		return res.json(data)
	}
}

export { UpdateOrderController, orderEmitter }
