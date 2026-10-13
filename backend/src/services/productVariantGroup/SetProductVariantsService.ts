import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";
import { setProductVariantsSchema } from "../../schemas/productVariantGroup/setProductVariants";
import { IProductVariantItem } from "../../interfaces/IProductVariantGroup";
import { PRODUCT_VARIANT_GROUP_INCLUDE } from "./productVariantGroupInclude";

interface ISetProductVariantsRequest {
    group_id: string
    variants: IProductVariantItem[]
}

// Replaces the full list of products (colors) of a variant group.
// Products removed from the list are detached (variant_group_id/color_id cleared), never deleted.
class SetProductVariantsService {
    async execute({ group_id, variants }: ISetProductVariantsRequest) {
        const group = await prismaClient.productVariantGroup.findUnique({
            where: { id: group_id },
        });

        if (!group) {
            throw new NotFoundException(
                "Variant group not found",
                ErrorCodes.PRODUCT_VARIANT_GROUP_NOT_FOUND
            );
        }

        const validVariants = await this.validate(variants, group_id);

        try {
            return await prismaClient.$transaction(async (tx) => {
                await this.apply(tx, group_id, validVariants);

                return tx.productVariantGroup.findUnique({
                    where: { id: group_id },
                    include: PRODUCT_VARIANT_GROUP_INCLUDE,
                });
            });
        } catch (error: any) {
            console.error("[SetProductVariantsService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }

    async validate(variants: IProductVariantItem[], groupId?: string) {
        const parsed = setProductVariantsSchema.safeParse({ variants });

        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.errors[0].message,
                ErrorCodes.VALIDATION_ERROR
            );
        }

        const productIds = parsed.data.variants.map(variant => variant.product_id);
        const colorIds = [...new Set(parsed.data.variants.map(variant => variant.color_id))];

        const [products, colors] = await Promise.all([
            prismaClient.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, name: true, variant_group_id: true },
            }),
            prismaClient.productColor.findMany({
                where: { id: { in: colorIds } },
                select: { id: true },
            }),
        ]);

        if (products.length !== productIds.length) {
            throw new NotFoundException(
                "One or more products were not found",
                ErrorCodes.BAD_REQUEST
            );
        }

        if (colors.length !== colorIds.length) {
            throw new NotFoundException(
                "One or more colors were not found",
                ErrorCodes.PRODUCT_COLOR_NOT_FOUND
            );
        }

        const productInAnotherGroup = products.find(product =>
            product.variant_group_id && product.variant_group_id !== groupId
        );

        if (productInAnotherGroup) {
            throw new BadRequestException(
                `Product "${productInAnotherGroup.name}" already belongs to another variant group`,
                ErrorCodes.PRODUCT_VARIANT_CONFLICT
            );
        }

        return parsed.data.variants;
    }

    async apply(tx: Prisma.TransactionClient, groupId: string, variants: IProductVariantItem[]) {
        // Detach every current member first so colors can be swapped between
        // products without hitting the (variant_group_id, color_id) unique index.
        await tx.product.updateMany({
            where: { variant_group_id: groupId },
            data: { variant_group_id: null, color_id: null, variant_order: 0 },
        });

        for (const [index, variant] of variants.entries()) {
            await tx.product.update({
                where: { id: variant.product_id },
                data: {
                    variant_group_id: groupId,
                    color_id: variant.color_id,
                    variant_order: variant.variant_order ?? index,
                },
            });
        }
    }
}

export { SetProductVariantsService };
