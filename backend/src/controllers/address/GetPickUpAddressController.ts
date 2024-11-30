import { Request, Response } from 'express'
import { CreateAddressService } from '../../services/address/CreateAddressService'
import { GetAllClientAddressService } from '../../services/address/GetAllClientAddressService'
import { CreateClientService } from '../../services/client/CreateClientService'
import { GetClientByPhoneNumberService } from '../../services/client/GetClientByPhoneNumberService'
import { IClient } from '../../interfaces/IClient'

class GetPickUpAddressController{
	async handle(req: Request, res: Response) {
		const street = "Av. Zulamith Bittencourt";
		const street_number = "68";
		const complement = "Ao lado da Quadra da AABB";
		const reference_point = "AABB";
		const neighborhood = "Centro";
		const city = "Itaperuna";
		const state = "RJ";
		const postal_code = "28300-000";
		const country = "Brasil";
		const storePhoneNumber = "22997517940";
		let client_id = "";

		const getClientService = new GetClientByPhoneNumberService();
		const createClientService = new CreateClientService();

		const getClient = await getClientService.execute(storePhoneNumber) as any;

		if (getClient) {
			client_id = getClient?.id;
		}

		if (!getClient) {
			const client = await createClientService.execute({
				first_name: "Mirai Flores",
				last_name: "Floricultura",
				phone_number: storePhoneNumber
			}) as IClient;

			client_id = client.id as string;
		}

		const getClientAddressService = new GetAllClientAddressService();
		let address = await getClientAddressService.execute(client_id) as any;

		if (address.length > 0) {
			address = address[0];
		}

		if (address.length === 0) {
			const createAddressService = new CreateAddressService();
			address = await createAddressService.execute({
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
			}) as any;
		}

		return res.json(address);
	}
}

export { GetPickUpAddressController }