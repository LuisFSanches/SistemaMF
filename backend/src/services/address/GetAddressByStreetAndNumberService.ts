import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAddressByStreetAndNumberService }
