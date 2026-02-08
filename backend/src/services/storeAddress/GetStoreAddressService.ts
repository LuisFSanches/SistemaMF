import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetStoreAddress {
    id: string;
}

class GetStoreAddressService {
    async execute({ id }: IGetStoreAddress) {
        try {
            const address = await prismaClient.storeAddress.findUnique({
                where: { id },
                include: {
                    store: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            });

            if (!address) {
                throw new BadRequestException(
                    "Address not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            return address;
        } catch (error: any) {
            console.error("[GetStoreAddressService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStoreAddressService };
