import prismaClient from "../../prisma";
import { BadRequestException } from "../../exceptions/bad-request";
import { ErrorCodes } from "../../exceptions/root";

interface IGetStoreProductByIdRequest {
    id: string;
}

class GetStoreProductByIdService {
    async execute({ id }: IGetStoreProductByIdRequest) {
        try {
            const storeProduct = await prismaClient.storeProduct.findUnique({
                where: { id },
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            unity: true,
                            description: true,
                            image: true,
                            image_2: true,
                            image_3: true,
                            categories: {
                                include: {
                                    category: {
                                        select: {
                                            id: true,
                                            name: true,
                                            slug: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!storeProduct) {
                throw new BadRequestException(
                    "Store product not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }

            // Retornar apenas os dados necessários para a PDP
            const productDetail = {
                id: storeProduct.id,
                store_id: storeProduct.store_id,
                product_id: storeProduct.product_id,
                price: storeProduct.price,
                stock: storeProduct.stock,
                enabled: storeProduct.enabled,
                visible_for_online_store: storeProduct.visible_for_online_store,
                product: {
                    id: storeProduct.product.id,
                    name: storeProduct.product.name,
                    unity: storeProduct.product.unity,
                    description: storeProduct.product.description,
                    image: storeProduct.product.image,
                    image_2: storeProduct.product.image_2,
                    image_3: storeProduct.product.image_3,
                    categories: storeProduct.product.categories.map((pc) => ({
                        category: pc.category,
                    })),
                },
                created_at: storeProduct.created_at,
                updated_at: storeProduct.updated_at,
            };

            return productDetail;
        } catch (error: any) {
            console.error("[GetStoreProductByIdService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetStoreProductByIdService };
