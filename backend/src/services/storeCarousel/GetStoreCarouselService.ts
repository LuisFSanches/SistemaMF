import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetStoreCarouselService {
    async execute({ id }: { id: string }) {
        const carousel = await prismaClient.storeCarousel.findFirst({
            where: { id },
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
                                        description: true,
                                        image: true,
                                        image_2: true,
                                        image_3: true,
                                        price: true,
                                        unity: true,
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

        if (!carousel) {
            throw new BadRequestException("Carousel not found", ErrorCodes.BAD_REQUEST);
        }

        return carousel;
    }
}

export { GetStoreCarouselService };
