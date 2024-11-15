import prismaClient from '../../prisma';
import { IClient } from "../../interfaces/IClient";
import { ErrorCodes } from "../../exceptions/root";

class UpdateClientService{
	async execute({ id, first_name, last_name, phone_number }: IClient) {
		console.log('id', id)
		try {
			const updateUser = await prismaClient.client.update({
				where: {
					id: id
				},
				data: {
					first_name,
					last_name,
					phone_number
				}
			})

			return { status: "Client successfully updated", client: updateUser };

		} catch(error: any) {
			return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
		}
	}
}

export { UpdateClientService }