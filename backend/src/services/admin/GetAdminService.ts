import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

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
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAdminService }