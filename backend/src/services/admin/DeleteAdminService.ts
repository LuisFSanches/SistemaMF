import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

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
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { DeleteAdminService }