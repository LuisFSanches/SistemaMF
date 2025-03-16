import {Request, Response, NextFunction} from 'express';
import { EventEmitter } from "events";
import { ErrorCodes } from "../../exceptions/root";
import { GetOrderService } from '../../services/order/GetOrderService'
import { CreateClientService } from '../../services/client/CreateClientService'
import { CreateAddressService } from '../../services/address/CreateAddressService'
import { FinishOnlineOrderService } from '../../services/order/FinishOnlineOrderService';
import { BadRequestException } from "../../exceptions/bad-request";

const orderEmitter = new EventEmitter();

class FinishOnlineOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const { order }: any = req.body;

        const first_name = order.first_name;
        const last_name = order.last_name;
        const phone_number = order.phone_number;
        let client_id = order.client_id;
        let client_address_id = order.address_id;
        let newAddress = order.newAddress;

        const getOrder = new GetOrderService();

        const orderFound = await getOrder.execute(order.id);

        if ('error' in orderFound) {
            return res.status(400).json(orderFound);
        }

        console.log(orderFound.online_code, order.online_code)
        
        if (orderFound.online_code !== order.online_code) {
            return res.status(401).json({
                error: true,
                message: 'Invalid order code',
                code: ErrorCodes.UNAUTHORIZED
            });
        }

        if (!order.client_id) {
			const createClientService = new CreateClientService();

			const client = await createClientService.execute({
				first_name,
				last_name,
				phone_number
			});

			if ('id' in client) {
				client_id = client.id;
			}
		}

        if (!client_address_id) {
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
			newAddress = true;
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
            delivery_date: new Date(`${order.delivery_date}T00:00:00Z`),
            pickup_on_store: order.pickup_on_store,
            has_card: order.has_card,
            card_message: order.card_message,
            online_code: order.online_code
        }

        const data = await finishOrderService.execute(orderData);

        if ('error' in data && data.error) {
            next(new BadRequestException(
                data.message,
                data.code
            ));
            
            return;
        }

        return res.json({ status: "Order successfully updated", order: data });
    }
}

export { FinishOnlineOrderController }