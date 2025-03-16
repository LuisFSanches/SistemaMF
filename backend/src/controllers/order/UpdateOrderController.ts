import {Request, Response, NextFunction} from 'express';
import { UpdateOrderService } from '../../services/order/UpdateOrderService';
import { UpdateAddressService } from '../../services/address/UpdateAddressService';
import { BadRequestException } from '../../exceptions/bad-request';
import { EventEmitter } from "events";

const orderEmitter = new EventEmitter();

class UpdateOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { order } = req.body;

		if (order.editAddress) {
			const { clientAddress } = order;
			const updateAddressService = new UpdateAddressService();

			const address = await updateAddressService.execute(clientAddress);
			
			if ('error' in address && address.error) {
				next(new BadRequestException(
					address.message,
					address.code
				));
				
				return;
			}
		}

		delete order.editAddress;
		delete order.clientAddress;

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
