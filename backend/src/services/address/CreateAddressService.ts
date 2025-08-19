import { IAddress } from "../../interfaces/IAddress";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class CreateAddressService{
	async execute(data: IAddress) {
		try {
			const address = await prismaClient.address.create({
				data
			})

			return address;

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { CreateAddressService }
