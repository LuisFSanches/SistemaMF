import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAddressService }
