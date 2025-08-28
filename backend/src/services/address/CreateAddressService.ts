import { IAddress } from "../../interfaces/IAddress";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateAddressService{
	async execute(data: IAddress) {
		try {
			const address = await prismaClient.address.create({
				data
			})

			return address;

		} catch(error: any) {
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { CreateAddressService }
