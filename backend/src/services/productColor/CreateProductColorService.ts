import { IProductColor } from "../../interfaces/IProductColor";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { createProductColorSchema } from "../../schemas/productColor/createProductColor";
import { BadRequestException } from "../../exceptions/bad-request";

class CreateProductColorService {
    async execute(data: IProductColor) {
        const parsed = createProductColorSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existingColor = await prismaClient.productColor.findFirst({
            where: { name: { equals: parsed.data.name, mode: 'insensitive' } },
        });

        if (existingColor) {
            throw new BadRequestException(
                "Color with this name already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        try {
            const color = await prismaClient.productColor.create({
                data: {
                    name: parsed.data.name,
                    hex: parsed.data.is_mixed ? null : parsed.data.hex ?? null,
                    is_mixed: parsed.data.is_mixed ?? false,
                    sort_order: parsed.data.sort_order ?? 0,
                }
            });

            return color;
        } catch (error: any) {
            console.error("[CreateProductColorService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateProductColorService };
