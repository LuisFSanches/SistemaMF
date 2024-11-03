import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

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
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { DeleteClientService }