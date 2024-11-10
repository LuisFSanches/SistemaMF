import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

  class GetAdminService{
    async execute(id: string) {
      try {
        const admin = await prismaClient.admin.findFirst({
          where: {
            id
          }
        });

        return admin;

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { GetAdminService }