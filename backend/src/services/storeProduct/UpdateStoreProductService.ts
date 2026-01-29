import { IStoreProduct } from "../../interfaces/IStoreProduct";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreProductSchema } from "../../schemas/storeProduct/updateStoreProduct";
import { BadRequestException } from "../../exceptions/bad-request";

interface IUpdateStoreProductRequest extends Partial<IStoreProduct> {
    id: string;
}

class UpdateStoreProductService {
    async execute({ id, ...data }: IUpdateStoreProductRequest) {
        // Validação com Zod
        const parsed = updateStoreProductSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se o produto da loja existe
        const storeProductExists = await prismaClient.storeProduct.findUnique({
            where: { id },
        });

        if (!storeProductExists) {
            throw new BadRequestException(
                "Store product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Atualizar o produto da loja
        try {
            const storeProduct = await prismaClient.storeProduct.update({
                where: { id },
                data: parsed.data,
                include: {
                    product: {
                        include: {
                            categories: true,
                        },
                    },
                    store: true,
                },
            });

            return storeProduct;
        } catch (error: any) {
            console.error("[UpdateStoreProductService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateStoreProductService };
