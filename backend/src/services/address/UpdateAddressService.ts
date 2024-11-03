import prismaClient from '../../prisma';
import { IAddress } from "../../interfaces/IAddress";
import { ErrorCodes } from "../../exceptions/root";

  class UpdateAddressService{
    async execute({ id, client_id, street, city, state, postal_code, country }: IAddress) {
      try {
        const updatedAddress = await prismaClient.address.update({
          where: {
            id
          },
          data: {
            client_id, street, city, state, postal_code, country
          }
        })

        return { status: "Address successfully deleted", address: updatedAddress };

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { UpdateAddressService }