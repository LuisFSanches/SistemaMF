import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface IDeleteStoreAddress {
    id: string;
}

class DeleteStoreAddressService {
    async execute({ id }: IDeleteStoreAddress) {
        // Verificar se o endereço existe
        const existingAddress = await prismaClient.storeAddress.findUnique({
            where: { id },
        });

        if (!existingAddress) {
            throw new BadRequestException(
                "Address not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            await prismaClient.storeAddress.delete({
                where: { id },
            });

            console.log(`[DeleteStoreAddressService] Address deleted: ${id}`);
            return { message: "Address deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreAddressService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteStoreAddressService };
