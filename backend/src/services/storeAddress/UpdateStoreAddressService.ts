import { IStoreAddress } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreAddressSchema } from "../../schemas/store/updateStoreAddress";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreAddress extends Partial<IStoreAddress> {
    id: string;
}

class UpdateStoreAddressService {
    async execute({ id, ...data }: IUpdateStoreAddress) {
        // Validação com Zod
        const parsed = updateStoreAddressSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

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
            // Se is_main for true, remover is_main de outros endereços da mesma loja
            if (data.is_main) {
                await prismaClient.storeAddress.updateMany({
                    where: { 
                        store_id: existingAddress.store_id,
                        id: { not: id },
                    },
                    data: { is_main: false },
                });
            }

            const address = await prismaClient.storeAddress.update({
                where: { id },
                data,
            });

            console.log(`[UpdateStoreAddressService] Address updated: ${address.id}`);
            return address;
        } catch (error: any) {
            console.error("[UpdateStoreAddressService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreAddressService };
