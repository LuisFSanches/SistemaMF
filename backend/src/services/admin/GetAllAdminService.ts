import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

  class GetAllAdminService{
    async execute() {
      try {
        const admins = await prismaClient.admin.findMany({
          where: {
            role: 'ADMIN'
          }
        });

        return { admins };

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { GetAllAdminService }