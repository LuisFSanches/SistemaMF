import {Request, Response, NextFunction} from 'express';
import { GetOrderService } from '../../services/order/GetOrderService'
import { CreateAddressService } from '../../services/address/CreateAddressService'
import { UpdateClientService } from '../../services/client/UpdateClientService';
import { FinishOnlineOrderService } from '../../services/order/FinishOnlineOrderService';
import { BadRequestException } from "../../exceptions/bad-request";

import { orderEmitter, OrderEvents } from '../../events/orderEvents';

class FinishOnlineOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { order }: any = req.body;

        let client_id = order.client_id;
        let client_address_id = order.clientAddress.id;

        const getOrder = new GetOrderService();

        const orderFound = await getOrder.execute(order.id);

        if ('error' in orderFound) {
            return res.status(400).json(orderFound);
        }

        if (!client_address_id || client_address_id === "") {
			const createAddressService = new CreateAddressService();
			const address = await createAddressService.execute({
				client_id,
				street: order.clientAddress.street,
				street_number: order.clientAddress.street_number,
				complement: order.clientAddress.complement,
				reference_point: order.clientAddress.reference_point,
				neighborhood: order.clientAddress.neighborhood,
				city: order.clientAddress.city,
				state: order.clientAddress.state,
				postal_code: order.clientAddress.postal_code,
				country: order.clientAddress.country
			});

			if ('id' in address) {
				client_address_id = address.id;
			}
		}

        const finishOrderService = new FinishOnlineOrderService();
        const orderData = {
            id: order.id,
            receiver_name: order.receiver_name,
            receiver_phone: order.receiver_phone,
            client_id: client_id,
            client_address_id,
            status: order.status,
            type_of_delivery: order.type_of_delivery,
            delivery_date: order.delivery_date,
            pickup_on_store: order.pickup_on_store,
            has_card: order.has_card,
            card_from: order.card_from,
            card_to: order.card_to,
            card_message: order.card_message,
            online_code: order.online_code
        }

        const data = await finishOrderService.execute(orderData);

        if ('error' in data && data.error) {
            console.log("[FinishOnlineOrderController] Starting order finalization", data.error);
            next(new BadRequestException(
                data.message,
                data.code
            ));
            return;
        }

        const updateClientService = new UpdateClientService();
        await updateClientService.execute({
            id: client_id,
            first_name: order.first_name,
            last_name: order.last_name,
            phone_number: order.phone_number
        });

        orderEmitter.emit(OrderEvents.OnlineOrderReceived, data);

        return res.json({ status: "Order successfully updated", order: data });
    }
}

export { FinishOnlineOrderController }