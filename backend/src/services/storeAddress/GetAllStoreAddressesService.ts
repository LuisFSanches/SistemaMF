import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetAllStoreAddresses {
    store_id: string;
}

class GetAllStoreAddressesService {
    async execute({ store_id }: IGetAllStoreAddresses) {
        try {
            const addresses = await prismaClient.storeAddress.findMany({
                where: { store_id },
                orderBy: [
                    { is_main: 'desc' },
                    { created_at: 'asc' },
                ],
            });

            return addresses;
        } catch (error: any) {
            console.error("[GetAllStoreAddressesService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllStoreAddressesService };
