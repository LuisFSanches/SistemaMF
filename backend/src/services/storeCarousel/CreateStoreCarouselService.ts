import { IStoreCarousel } from "../../interfaces/IStoreCarousel";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createStoreCarouselSchema } from "../../schemas/storeCarousel/createStoreCarousel";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateStoreCarouselService {
    async execute(data: IStoreCarousel) {
        const parsed = createStoreCarouselSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const { store_id, name, is_active, product_ids } = parsed.data;

        // Validate that all store_product_ids belong to this store
        const storeProducts = await prismaClient.storeProduct.findMany({
            where: {
                id: { in: product_ids },
                store_id,
            },
            select: { id: true },
        });

        if (storeProducts.length !== product_ids.length) {
            throw new BadRequestException(
                "One or more products do not belong to this store",
                ErrorCodes.BAD_REQUEST
            );
        }

        try {
            const carousel = await prismaClient.storeCarousel.create({
                data: {
                    store_id,
                    name,
                    is_active: is_active ?? true,
                    items: {
                        createMany: {
                            data: product_ids.map((store_product_id, index) => ({
                                store_product_id,
                                position: index,
                            })),
                        },
                    },
                },
                include: {
                    items: {
                        orderBy: { position: "asc" },
                        include: {
                            storeProduct: {
                                include: {
                                    product: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                            price: true,
                                            unity: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return carousel;
        } catch (error: any) {
            console.error("[CreateStoreCarouselService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { CreateStoreCarouselService };
