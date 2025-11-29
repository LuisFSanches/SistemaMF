import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface GetDeliveryManByPhoneRequest {
    phone_code: string
}

class GetDeliveryManByPhoneService {
    async execute({ phone_code }: GetDeliveryManByPhoneRequest) {
        if (!phone_code) {
            throw new BadRequestException(
                "phone_code is required",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        if (phone_code.length !== 4) {
            throw new BadRequestException(
                "phone_code must have exactly 4 digits",
                ErrorCodes.VALIDATION_ERROR
            );
        }

        try {
            // Buscar entregador cujo telefone termine com os 4 dígitos informados
            const deliveryMan = await prismaClient.deliveryMan.findFirst({
                where: { 
                    phone_number: {
                        endsWith: phone_code
                    }
                }
            });

            if (!deliveryMan) {
                throw new BadRequestException(
                    "Delivery man not found with these last 4 digits",
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
