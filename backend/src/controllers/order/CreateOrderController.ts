import {Request, Response, NextFunction} from 'express'
import { ErrorCodes } from "../../exceptions/root";
import { UnauthorizedRequestException } from "../../exceptions/unauthorized";
import { BadRequestException } from "../../exceptions/bad-request";
import { CreateOrderService } from '../../services/order/CreateOrderService'
import { CreateClientService } from '../../services/client/CreateClientService'
import { CreateAddressService } from '../../services/address/CreateAddressService'
import { DeleteAddressService } from '../../services/address/DeleteAddressService'
import { GetAdminService } from '../../services/admin/GetAdminService'

class CreateOrderController{
	async handle(req: Request, res: Response, next: NextFunction) {
		const {
			admin_id,
			clientId,
			first_name,
			last_name,
			phone_number,
			addressId,
			street,
			street_number,
			complement,
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
			status,
			has_card,
		} = req.body;

		let client_id = clientId;
		let address_id = addressId;
		let newAddress = false;

		const adminService = new GetAdminService();

		const admin = await adminService.execute(admin_id);

		if (!admin || 'error' in admin) {
			throw next(new UnauthorizedRequestException('Unauthorized', ErrorCodes.UNAUTHORIZED))
		}

		if (!client_id) {
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

		if (!address_id) {
			const createAddressService = new CreateAddressService();
			const address = await createAddressService.execute({
				client_id,
				street,
				street_number,
				complement,
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

		const createOrderService = new CreateOrderService();

		const order = await createOrderService.execute({
			description,
			additional_information,
			client_id,
			client_address_id: address_id,
			products_value,
			delivery_fee,
			total,
			created_by: admin_id,
			updated_by: admin_id,
			status,
			has_card: has_card,
		});

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

		return res.json(order);
	}
}

export { CreateOrderController }