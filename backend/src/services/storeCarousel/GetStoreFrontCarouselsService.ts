import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetStoreFrontCarouselsService {
    async execute({ slug }: { slug: string }) {
        const store = await prismaClient.store.findFirst({
            where: { slug },
            select: { id: true },
        });

        if (!store) {
            throw new BadRequestException("Store not found", ErrorCodes.BAD_REQUEST);
        }

        try {
            const carousels = await prismaClient.storeCarousel.findMany({
                where: {
                    store_id: store.id,
                    is_active: true,
                },
                orderBy: { created_at: "asc" },
                include: {
                    items: {
                        orderBy: { position: "asc" },
                        where: {
                            storeProduct: {
                                enabled: true,
                                visible_for_online_store: true,
                            },
                        },
                        include: {
                            storeProduct: {
                                select: {
                                    id: true,
                                    price: true,
                                    stock: true,
                                    product: {
                                        select: {
                                            id: true,
                                            name: true,
                                            description: true,
                                            image: true,
                                            image_2: true,
                                            image_3: true,
                                            unity: true,
                                            sales_count: true,
                                            categories: {
                                                include: {
                                                    category: {
                                                        select: { id: true, name: true, slug: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            return carousels;
        } catch (error: any) {
            console.error("[GetStoreFrontCarouselsService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { GetStoreFrontCarouselsService };
