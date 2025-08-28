import { ErrorCodes } from "../../exceptions/root";
import { IAdmin } from "../../interfaces/IAdmin";
import prismaClient from '../../prisma';
import { compareSync } from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { BadRequestException } from "../../exceptions/bad-request";

class LoginAdminService{
    async execute({ username, password }: IAdmin) {
        try {
            const admin = await prismaClient.admin.findFirst({
                where: {
                username,
                },
            })

            if (!admin) {
                throw new BadRequestException(
                    'Admin not found',
                    ErrorCodes.USER_NOT_FOUND
                )
            }

            if (!compareSync(password, admin.password)) {
                throw new BadRequestException(
                    'Wrong password',
                    ErrorCodes.INCORRECT_PASSWORD
                )
            }

            const token = jwt.sign({
                id: admin.id,
                role: admin.role
            }, process.env.JWT_SECRET!, {
                expiresIn: '1y'
            })

            delete (admin as { password?: string }).password;

            return { admin, token }

        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { LoginAdminService }