import { IUpdateStoreCarousel } from "../../interfaces/IStoreCarousel";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateStoreCarouselSchema } from "../../schemas/storeCarousel/updateStoreCarousel";
import { BadRequestException } from "../../exceptions/bad-request";

class UpdateStoreCarouselService {
    async execute(data: IUpdateStoreCarousel) {
        const { id, product_ids, ...rest } = data;

        const parsed = updateStoreCarouselSchema.safeParse(rest);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existing = await prismaClient.storeCarousel.findFirst({ where: { id } });

        if (!existing) {
            throw new BadRequestException("Carousel not found", ErrorCodes.BAD_REQUEST);
        }

        // If product_ids is provided, validate they belong to the store
        if (product_ids && product_ids.length > 0) {
            const storeProducts = await prismaClient.storeProduct.findMany({
                where: {
                    id: { in: product_ids },
                    store_id: existing.store_id,
                },
                select: { id: true },
            });

            if (storeProducts.length !== product_ids.length) {
                throw new BadRequestException(
                    "One or more products do not belong to this store",
                    ErrorCodes.BAD_REQUEST
                );
            }
        }

        try {
            const updateData: any = { ...parsed.data };

            if (product_ids && product_ids.length > 0) {
                // Replace all items atomically
                await prismaClient.storeCarouselItem.deleteMany({ where: { carousel_id: id } });
                updateData.items = {
                    createMany: {
                        data: product_ids.map((store_product_id, index) => ({
                            store_product_id,
                            position: index,
                        })),
                    },
                };
            }

            const carousel = await prismaClient.storeCarousel.update({
                where: { id },
                data: updateData,
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
            console.error("[UpdateStoreCarouselService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { UpdateStoreCarouselService };
