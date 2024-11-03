import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

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
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { GetClientService }