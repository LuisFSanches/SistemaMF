import { IAdmin } from "../../interfaces/IAdmin";
import prismaClient from '../../prisma';
import { hash } from 'bcrypt'
import { ErrorCodes } from "../../exceptions/root";

  class CreateAdminService{
    async execute({ username, name, password, role }: IAdmin) {

      const hashedPassword = await hash(password, 10);

      const admin = await prismaClient.admin.findFirst({
        where: {
          username
        }
      })

      if (admin) {
        return { error: true, message: 'Admin already created', code: ErrorCodes.USER_ALREADY_EXISTS }
      }

      try {
        const newAdmin =await prismaClient.admin.create({
          data: {
            username,
            name,
            password: hashedPassword,
            role
          }
        })

      return { admin: newAdmin };

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { CreateAdminService }