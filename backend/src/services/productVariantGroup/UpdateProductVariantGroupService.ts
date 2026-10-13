import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";
import { updateProductVariantGroupSchema } from "../../schemas/productVariantGroup/updateProductVariantGroup";
import { PRODUCT_VARIANT_GROUP_INCLUDE } from "./productVariantGroupInclude";

interface IUpdateProductVariantGroupRequest {
    id: string
    name?: string
    description?: string | null
}

class UpdateProductVariantGroupService {
    async execute({ id, ...data }: IUpdateProductVariantGroupRequest) {
        const parsed = updateProductVariantGroupSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existingGroup = await prismaClient.productVariantGroup.findUnique({
            where: { id },
        });

        if (!existingGroup) {
            throw new NotFoundException(
                "Variant group not found",
                ErrorCodes.PRODUCT_VARIANT_GROUP_NOT_FOUND
            );
        }

        if (parsed.data.name && parsed.data.name.toLowerCase() !== existingGroup.name.toLowerCase()) {
            const groupWithName = await prismaClient.productVariantGroup.findFirst({
                where: { name: { equals: parsed.data.name, mode: 'insensitive' } },
            });

            if (groupWithName) {
                throw new BadRequestException(
                    "Variant group with this name already exists",
                    ErrorCodes.USER_ALREADY_EXISTS
                );
            }
        }

        try {
            return await prismaClient.productVariantGroup.update({
                where: { id },
                data: parsed.data,
                include: PRODUCT_VARIANT_GROUP_INCLUDE,
            });
        } catch (error: any) {
            console.error("[UpdateProductVariantGroupService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { UpdateProductVariantGroupService };
