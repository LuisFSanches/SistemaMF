import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class DeleteStoreCarouselService {
    async execute({ id }: { id: string }) {
        const existing = await prismaClient.storeCarousel.findFirst({ where: { id } });

        if (!existing) {
            throw new BadRequestException("Carousel not found", ErrorCodes.BAD_REQUEST);
        }

        try {
            await prismaClient.storeCarousel.delete({ where: { id } });

            return { message: "Carousel deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteStoreCarouselService] Failed:", error);
            throw new BadRequestException(error.message, ErrorCodes.SYSTEM_ERROR);
        }
    }
}

export { DeleteStoreCarouselService };
