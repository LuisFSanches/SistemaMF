import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAllClientAddressService{
    async execute(client_id: string) {
        try {
            const address = await prismaClient.address.findMany({
                where: {
                    client_id
                }
            });

            return address;

        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { GetAllClientAddressService }