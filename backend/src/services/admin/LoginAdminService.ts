import { ErrorCodes } from "../../exceptions/root";
import { IAdmin } from "../../interfaces/IAdmin";
import prismaClient from '../../prisma';
import { compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'

class LoginAdminService{

  async execute({ username, password }: IAdmin) {
    try {
      const admin = await prismaClient.admin.findFirst({
        where: {
          username,
        },
      })

      if (!admin) {
        return { error: true, message: 'Admin not found', code: ErrorCodes.USER_NOT_FOUND }
      }

      if (!compareSync(password, admin.password)) {
        return { error: true, message: 'Wrong password', code: ErrorCodes.INCORRECT_PASSWORD }
      }

      const token = jwt.sign({
        id: admin.id,
        role: admin.role
      }, process.env.JWT_SECRET!, {
        expiresIn: '1w'
      })

      delete (admin as { password?: string }).password;

      return { admin, token }

    } catch(error: any) {
      return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
    }
  }
}

export { LoginAdminService }