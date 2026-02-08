import { IStoreCredentials } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreCredentialsSchema } from "../../schemas/store/updateStoreCredentials";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateStoreCredentialsService {
    async execute(data: IStoreCredentials) {
        const { store_id, ...credentials } = data;

        // Validação com Zod
        const parsed = updateStoreCredentialsSchema.safeParse(credentials);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se store existe
        const existingStore = await prismaClient.store.findFirst({
            where: { id: store_id },
        });

        if (!existingStore) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        try {
            const updatedStore = await prismaClient.store.update({
                where: { id: store_id },
                data: credentials,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    payment_enabled: true,
                    updated_at: true,
                },
            });

            return {
                message: "Store credentials updated successfully",
                store: updatedStore,
            };
        } catch (error: any) {
            console.error("[UpdateStoreCredentialsService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreCredentialsService };
