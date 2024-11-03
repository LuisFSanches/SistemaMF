import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

  class GetAllClientService{
    async execute() {
      try {
        const users = await prismaClient.client.findMany();

        return { users };

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { GetAllClientService }