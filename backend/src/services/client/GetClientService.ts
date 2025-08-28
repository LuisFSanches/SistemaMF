import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetClientService{
    async execute(id: string) {
        try {
            const user = await prismaClient.client.findFirst({
                where: {
                id
                }
            });

            return { user };

        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetClientService }