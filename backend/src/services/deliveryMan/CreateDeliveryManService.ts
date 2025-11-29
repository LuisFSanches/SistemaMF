import { IDeliveryMan } from "../../interfaces/IDeliveryMan";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createDeliveryManSchema } from "../../schemas/deliveryMan/createDeliveryMan";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateDeliveryManService {
    async execute(data: IDeliveryMan) {
        const parsed = createDeliveryManSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existingDeliveryMan = await prismaClient.deliveryMan.findFirst({
            where: { phone_number: parsed.data.phone_number },
        });

        if (existingDeliveryMan) {
            throw new BadRequestException(
                "Delivery man with this phone number already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const deliveryMan = await prismaClient.deliveryMan.create({ 
                data: {
                    name: parsed.data.name,
                    phone_number: parsed.data.phone_number
                }
            });
            
            return deliveryMan;
        } catch (error: any) {
            console.error("[CreateDeliveryManService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateDeliveryManService };
