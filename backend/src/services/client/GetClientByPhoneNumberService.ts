import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

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
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { GetClientByPhoneNumberService }