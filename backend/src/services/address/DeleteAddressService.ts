import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

  class DeleteAddressService{
    async execute(id: string) {
      try {
        await prismaClient.address.delete({
          where: {
            id
          }
        })

        return { Status: "Address successfully deleted" };

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { DeleteAddressService }