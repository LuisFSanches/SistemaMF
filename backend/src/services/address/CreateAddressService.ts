import { IAddress } from "../../interfaces/IAddress";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class CreateAddressService{
	async execute({
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
	}: IAddress) {

		try {
			const address = await prismaClient.address.create({
				data: {
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
				}
			})

			return address;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { CreateAddressService }