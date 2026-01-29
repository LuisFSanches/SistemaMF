import { IDeliveryMan } from "../../interfaces/IDeliveryMan";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateDeliveryManSchema } from "../../schemas/deliveryMan/updateDeliveryMan";
import { BadRequestException } from "../../exceptions/bad-request";

interface UpdateDeliveryManRequest extends Partial<IDeliveryMan> {
    id: string
}

class UpdateDeliveryManService {
    async execute({ id, ...data }: UpdateDeliveryManRequest, store_id?: string) {
        const parsed = updateDeliveryManSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const whereClause: any = { id };
        if (store_id) {
            whereClause.store_id = store_id;
        }

        const existingDeliveryMan = await prismaClient.deliveryMan.findFirst({
            where: whereClause
        });

        if (!existingDeliveryMan) {
            throw new BadRequestException(
                "Delivery man not found",
                ErrorCodes.USER_NOT_FOUND
            );
        }

        if (parsed.data.phone_number && parsed.data.phone_number !== existingDeliveryMan.phone_number) {
            const phoneWhereClause: any = { 
                phone_number: parsed.data.phone_number,
                id: { not: id }
            };
            if (store_id) {
                phoneWhereClause.store_id = store_id;
            }

            const phoneInUse = await prismaClient.deliveryMan.findFirst({
                where: phoneWhereClause
            });

            if (phoneInUse) {
                throw new BadRequestException(
                    "Phone number already in use by another delivery man",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        try {
            const deliveryMan = await prismaClient.deliveryMan.update({
                where: { id },
                data: parsed.data
            });
            
            return deliveryMan;
        } catch (error: any) {
            console.error("[UpdateDeliveryManService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateDeliveryManService };
