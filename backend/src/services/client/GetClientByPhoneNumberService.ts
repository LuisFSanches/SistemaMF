import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetClientByPhoneNumberService{
    async execute(phone_number: string) {      
        try {
            if (!phone_number) return null;

            const client = await prismaClient.client.findFirst({
                where: {
                phone_number
                }
            });

            return client;

        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            )
        }
    }
}

export { GetClientByPhoneNumberService }