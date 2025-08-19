import {Request, Response, NextFunction} from 'express'
import { BadRequestException } from "../../exceptions/bad-request";
import { CreateOrderService } from '../../services/order/CreateOrderService'
import { CreateClientService } from '../../services/client/CreateClientService'
import { CreateAddressService } from '../../services/address/CreateAddressService'
import { DeleteAddressService } from '../../services/address/DeleteAddressService'
import { GetClientByPhoneNumberService } from '../../services/client/GetClientByPhoneNumberService'
import { GetAllClientAddressService } from '../../services/address/GetAllClientAddressService'

class CreateOrderController{
	handle = async (req: Request, res: Response, next: NextFunction) => {
		const {
			clientId,
			first_name,
			last_name,
			phone_number,
			receiver_name,
			receiver_phone,
			addressId,
			pickup_on_store,
			street,
			street_number,
			complement,
			reference_point,
			neighborhood,
			city,
			state,
			postal_code,
			country,
			description,
			additional_information,
			products_value,
			delivery_fee,
			total,
			payment_method,
			payment_received,
			delivery_date,
			status,
			has_card,
			created_by,
			online_order,
			online_code,
			products,
			is_delivery
		} = req.body;

		let client_id = clientId;
		let address_id = addressId;
		let newAddress = false;

		if (!client_id && !online_order && first_name) {
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

		if (!is_delivery) {
			const defaultUserId = await this.getDefaultUserId();
			if (!client_id) {
				client_id = defaultUserId;
			}
			const getClientAddressService = new GetAllClientAddressService();
			let address = await getClientAddressService.execute(defaultUserId) as any;
			address_id = address[0]?.id;
		}

		if (!address_id && !online_order && is_delivery) {
			const createAddressService = new CreateAddressService();
			const address = await createAddressService.execute({
				client_id,
				street,
				street_number,
				complement,
				reference_point,
				neighborhood,
				city,
				state,
				postal_code,
				country
			});

			if ('id' in address) {
				address_id = address.id;
			}
			newAddress = true;
		}

		if (online_order) {
			const defaultUserId = await this.getDefaultUserId();
			client_id = defaultUserId;

			const getClientAddressService = new GetAllClientAddressService();
			let address = await getClientAddressService.execute(client_id) as any;
			address_id = address[0]?.id;
		}

		const createOrderService = new CreateOrderService();

		const order = await createOrderService.execute({
			description,
			additional_information,
			client_id,
			client_address_id: address_id,
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
			updated_by: created_by,
			status,
			has_card: has_card,
			online_order,
			online_code,
			is_delivery
		}, products) as any;

		if ('error' in order && order.error) {
			next(new BadRequestException(
				order.message,
				order.code
			));

			if (newAddress) {
				const deleteAddressService = new DeleteAddressService();
    			await deleteAddressService.execute(address_id);
			}
			return;
		}

		if (online_order) {
			return res.json({
				order,
			});
		}
		if (!online_order) {
			return res.json(order);
		}
	}

	/*
	* Get default user
	* @returns {string}
	*/
	async getDefaultUserId(): Promise<string> {
		const storePhoneNumber = "22997517940";
		const getClientService = new GetClientByPhoneNumberService();
		const getClient = await getClientService.execute(storePhoneNumber) as any;
		
		return getClient.id
	}
}

export { CreateOrderController }