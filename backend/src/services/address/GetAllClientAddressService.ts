import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllClientAddressService }