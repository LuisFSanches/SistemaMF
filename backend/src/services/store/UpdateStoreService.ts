import { IStore } from "../../interfaces/IStore";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreSchema } from "../../schemas/store/updateStore";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStore extends Partial<IStore> {
    id: string;
}

class UpdateStoreService {
    async execute(data: IUpdateStore) {
        const { id, ...updateData } = data;

        // Validação com Zod
        const parsed = updateStoreSchema.safeParse(updateData);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se store existe
        const existingStore = await prismaClient.store.findFirst({
            where: { id },
        });

        if (!existingStore) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se slug já existe (se estiver sendo atualizado)
        if (updateData.slug && updateData.slug !== existingStore.slug) {
            const slugExists = await prismaClient.store.findFirst({
                where: { 
                    slug: updateData.slug,
                    id: { not: id },
                },
            });

            if (slugExists) {
                throw new BadRequestException(
                    "Store with this slug already exists",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        // Verificar se CNPJ já existe (se estiver sendo atualizado)
        if (updateData.cnpj && updateData.cnpj !== existingStore.cnpj) {
            const cnpjExists = await prismaClient.store.findFirst({
                where: { 
                    cnpj: updateData.cnpj,
                    id: { not: id },
                },
            });

            if (cnpjExists) {
                throw new BadRequestException(
                    "Store with this CNPJ already exists",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        try {
            const updatedStore = await prismaClient.store.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    cnpj: true,
                    phone_number: true,
                    email: true,
                    description: true,
                    is_active: true,
                    is_first_access: true,
                    payment_enabled: true,
                    logo: true,
                    banner: true,
                    created_at: true,
                    updated_at: true,
                },
            });

            return updatedStore;
        } catch (error: any) {
            console.error("[UpdateStoreService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreService };
