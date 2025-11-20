import {Request, Response, NextFunction} from 'express'
import { OrderFacade } from '../../facades/OrderFacade';
import { CreateOrderService } from '../../services/order/CreateOrderService';
import { CreateClientService } from '../../services/client/CreateClientService';
import { CreateAddressService } from '../../services/address/CreateAddressService';
import { GetClientByPhoneNumberService } from '../../services/client/GetClientByPhoneNumberService';
import { GetAllClientAddressService } from '../../services/address/GetAllClientAddressService';
import { GetAddressByStreetAndNumberService } from "../../services/address/GetAddressByStreetAndNumberService";
import { orderEmitter, OrderEvents } from '../../events/orderEvents';

class CreateOrderController{
	/**
	 * @var OrderFacade
	 */
	private orderFacade: OrderFacade;

	constructor(){
		this.orderFacade = new OrderFacade(
			new CreateClientService(),
			new GetClientByPhoneNumberService(),
			new CreateAddressService(),
			new GetAllClientAddressService(),
			new GetAddressByStreetAndNumberService(),
			new CreateOrderService()
		);
	}

	handle = async (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		const order = await this.orderFacade.createOrder(data);

		if (!order.created_by) {
			orderEmitter.emit(OrderEvents.StoreFrontOderReceived, order);
		}

		return res.json(order)
	}
}

export { CreateOrderController }