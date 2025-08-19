import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { deleteAddressSchema } from "../../schemas/address/deleteAddress";

class DeleteAddressService {
    async execute(id: string) {
        try {
            const parsed = deleteAddressSchema.safeParse(id);
            if (!parsed.success) {
                return {
                    error: true,
                    message: parsed.error.errors[0].message,
                    code: ErrorCodes.VALIDATION_ERROR
                };
            }

            await prismaClient.address.delete({
                where: { id }
            })

            return { Status: "Address successfully deleted" };

        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { DeleteAddressService }
