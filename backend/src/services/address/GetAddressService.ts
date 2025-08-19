import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAddressService{
    async execute(id: string) {
        try {
            const address = await prismaClient.address.findFirst({
                where: {
                    id
                }
            });

            return { address };

        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { GetAddressService }
