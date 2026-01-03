import { IStoreAddress } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreAddressSchema } from "../../schemas/store/createStoreAddress";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStoreAddressService {
    async execute(data: IStoreAddress) {
        // Validação com Zod
        const parsed = createStoreAddressSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se a loja existe
        const store = await prismaClient.store.findUnique({
            where: { id: data.store_id },
        });

        if (!store) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            // Se is_main for true, remover is_main de outros endereços
            if (data.is_main) {
                await prismaClient.storeAddress.updateMany({
                    where: { store_id: data.store_id },
                    data: { is_main: false },
                });
            }

            const address = await prismaClient.storeAddress.create({
                data: {
                    store_id: data.store_id,
                    street: data.street,
                    street_number: data.street_number,
                    complement: data.complement,
                    neighborhood: data.neighborhood,
                    reference_point: data.reference_point,
                    city: data.city,
                    state: data.state,
                    postal_code: data.postal_code,
                    country: data.country || "Brasil",
                    is_main: data.is_main ?? false,
                },
            });

            console.log(`[CreateStoreAddressService] Address created: ${address.id}`);
            return address;
        } catch (error: any) {
            console.error("[CreateStoreAddressService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStoreAddressService };
