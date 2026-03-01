import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllStoreCarouselsService {
    async execute({ store_id }: { store_id: string }) {
        if (!store_id) {
            throw new BadRequestException("store_id is required", ErrorCodes.VALIDATION_ERROR);
        }

        try {
            const carousels = await prismaClient.storeCarousel.findMany({
                where: { store_id },
                orderBy: { created_at: "desc" },
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

            return carousels;
        } catch (error: any) {
            console.error("[GetAllStoreCarouselsService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { GetAllStoreCarouselsService };
