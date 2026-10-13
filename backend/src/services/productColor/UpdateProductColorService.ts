import { IProductColor } from "../../interfaces/IProductColor";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { updateProductColorSchema } from "../../schemas/productColor/updateProductColor";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";

interface IUpdateProductColorRequest extends Partial<IProductColor> {
    id: string
}

class UpdateProductColorService {
    async execute({ id, ...data }: IUpdateProductColorRequest) {
        const parsed = updateProductColorSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existingColor = await prismaClient.productColor.findUnique({
            where: { id },
        });

        if (!existingColor) {
            throw new NotFoundException(
                "Color not found",
                ErrorCodes.PRODUCT_COLOR_NOT_FOUND
            );
        }

        if (parsed.data.name && parsed.data.name.toLowerCase() !== existingColor.name.toLowerCase()) {
            const colorWithName = await prismaClient.productColor.findFirst({
                where: { name: { equals: parsed.data.name, mode: 'insensitive' } },
            });

            if (colorWithName) {
                throw new BadRequestException(
                    "Color with this name already exists",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        try {
            const color = await prismaClient.productColor.update({
                where: { id },
                data: {
                    ...parsed.data,
                    hex: parsed.data.is_mixed ? null : parsed.data.hex,
                }
            });

            return color;
        } catch (error: any) {
            console.error("[UpdateProductColorService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateProductColorService };
