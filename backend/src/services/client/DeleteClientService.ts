import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { InternalServiceException } from "../../exceptions/internal";

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
            throw new InternalServiceException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            )
        }
    }
}

export { DeleteClientService }