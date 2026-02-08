import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

interface GetDeliveryManByPhoneRequest {
    phone_code: string
    store_id?: string
}

class GetDeliveryManByPhoneService {
    async execute({ phone_code, store_id }: GetDeliveryManByPhoneRequest) {
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
            const whereClause: any = {
                phone_number: {
                    endsWith: phone_code
                }
            };
            if (store_id) {
                whereClause.store_id = store_id;
            }

            const deliveryMan = await prismaClient.deliveryMan.findFirst({
                where: whereClause
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
