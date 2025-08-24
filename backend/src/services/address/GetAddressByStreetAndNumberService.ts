import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAddressByStreetAndNumberService {
    async execute(client_id: string, street: string, street_number: string) {
        try {
            const address = await prismaClient.address.findFirst({
                where: {
                    street,
                    street_number,
                    client_id
                }
            });

            return address;

        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { GetAddressByStreetAndNumberService }
