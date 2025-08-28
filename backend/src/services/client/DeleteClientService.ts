import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteClientService{
    async execute(id: string) {
        try {
            await prismaClient.client.delete({
                where: {
                    id
                }
            })

            return { Status: "Client successfully deleted" };

        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            )
        }
    }
}

export { DeleteClientService }