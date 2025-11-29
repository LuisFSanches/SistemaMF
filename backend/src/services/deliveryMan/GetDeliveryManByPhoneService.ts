import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface GetDeliveryManByPhoneRequest {
    phone_number: string
}

class GetDeliveryManByPhoneService {
    async execute({ phone_number }: GetDeliveryManByPhoneRequest) {
        if (!phone_number) {
            throw new BadRequestException(
                "phone_number is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            const deliveryMan = await prismaClient.deliveryMan.findFirst({
                where: { phone_number }
            });

            if (!deliveryMan) {
                throw new BadRequestException(
                    "Delivery man not found",
                    ErrorCodes.USER_NOT_FOUND
                );
            }
            
            return deliveryMan;
        } catch (error: any) {
            console.error("[GetDeliveryManByPhoneService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetDeliveryManByPhoneService };
