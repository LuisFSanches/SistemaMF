import prismaClient from '../../prisma';
import { IClient } from "../../interfaces/IClient";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
class UpdateClientService{
	async execute({ id, first_name, last_name, phone_number, country_code }: IClient) {
		try {
			const updateUser = await prismaClient.client.update({
				where: {
					id: id
				},
				data: {
					first_name,
					last_name,
					phone_number,
					country_code
				}
			})

			return updateUser;

		} catch(error: any) {
			throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
		}
	}
}

export { UpdateClientService }