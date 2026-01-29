import { IStoreProduct } from "../../interfaces/IStoreProduct";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreProductSchema } from "../../schemas/storeProduct/createStoreProduct";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStoreProductService {
    async execute(data: IStoreProduct) {
        // Validação com Zod
        const parsed = createStoreProductSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        // Verificar se a loja existe
        const storeExists = await prismaClient.store.findUnique({
            where: { id: data.store_id },
        });

        if (!storeExists) {
            throw new BadRequestException(
                "Store not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se o produto existe
        const productExists = await prismaClient.product.findUnique({
            where: { id: data.product_id },
        });

        if (!productExists) {
            throw new BadRequestException(
                "Product not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        // Verificar se o produto já está associado à loja
        const storeProductExists = await prismaClient.storeProduct.findUnique({
            where: {
                store_id_product_id: {
                    store_id: data.store_id,
                    product_id: data.product_id,
                },
            },
        });

        if (storeProductExists) {
            throw new BadRequestException(
                "Product already exists in this store",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        // Criar o produto da loja
        try {
            const storeProduct = await prismaClient.storeProduct.create({
                data: {
                    store_id: data.store_id,
                    product_id: data.product_id,
                    price: data.price,
                    stock: data.stock,
                    enabled: data.enabled ?? true,
                    visible_for_online_store: data.visible_for_online_store ?? true,
                },
                include: {
                    product: true,
                    store: true,
                },
            });

            return storeProduct;
        } catch (error: any) {
            console.error("[CreateStoreProductService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateStoreProductService };
