import { IClient } from "../../interfaces/IClient";
import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
  
class CreateClientService{
  async execute({ first_name, last_name, phone_number }: IClient) {

    try {
      const client = await prismaClient.client.findFirst({
        where: {
          phone_number
        }
      })

      if (client) {
        return { error: true, message: 'Client already created', code: ErrorCodes.USER_ALREADY_EXISTS }
      }

      const newClient = await prismaClient.client.create({
        data: {
          first_name,
          last_name,
          phone_number,
        }
      })

      return newClient;

    } catch(error: any) {
      console.log('data', { first_name, last_name, phone_number })
      console.log("[FinishOnlineOrderController] Failed to create client on order finalization", error.message);

      return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
    }
  }
}

export { CreateClientService }
