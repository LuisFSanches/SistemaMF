import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { createProductVariantGroupSchema } from "../../schemas/productVariantGroup/createProductVariantGroup";
import { IProductVariantGroup } from "../../interfaces/IProductVariantGroup";
import { SetProductVariantsService } from "./SetProductVariantsService";
import { PRODUCT_VARIANT_GROUP_INCLUDE } from "./productVariantGroupInclude";

class CreateProductVariantGroupService {
    async execute(data: IProductVariantGroup) {
        const parsed = createProductVariantGroupSchema.safeParse(data);

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const existingGroup = await prismaClient.productVariantGroup.findFirst({
            where: { name: { equals: parsed.data.name, mode: 'insensitive' } },
        });

        if (existingGroup) {
            throw new BadRequestException(
                "Variant group with this name already exists",
                ErrorCodes.USER_ALREADY_EXISTS
            );
        }

        const setProductVariantsService = new SetProductVariantsService();
        const variants = await setProductVariantsService.validate(parsed.data.variants || []);

        try {
            return await prismaClient.$transaction(async (tx) => {
                const group = await tx.productVariantGroup.create({
                    data: {
                        name: parsed.data.name,
                        description: parsed.data.description ?? null,
                    },
                });

                await setProductVariantsService.apply(tx, group.id, variants);

                return tx.productVariantGroup.findUnique({
                    where: { id: group.id },
                    include: PRODUCT_VARIANT_GROUP_INCLUDE,
                });
            });
        } catch (error: any) {
            console.error("[CreateProductVariantGroupService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { CreateProductVariantGroupService };
