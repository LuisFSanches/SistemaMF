import prismaClient from '../../prisma';
import { IAddress } from "../../interfaces/IAddress";
import { ErrorCodes } from "../../exceptions/root";

class UpdateAddressService{
	async execute(address: IAddress) {
		try {
			const updatedAddress = await prismaClient.address.update({
				where: {
					id: address.id
				},
				data: address
			})
			
			return { status: "Address successfully updated", address: updatedAddress };

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { UpdateAddressService }