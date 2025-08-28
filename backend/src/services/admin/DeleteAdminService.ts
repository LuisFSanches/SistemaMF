import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteAdminService{
    async execute(id: string) {
        try {
            await prismaClient.admin.delete({
                where: {
                    id
                }
            })

            return { Status: "Admin successfully deleted" };

        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteAdminService }