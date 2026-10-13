import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";

interface IDeleteProductVariantGroupRequest {
    id: string
}

// Deletes only the grouping: the products themselves are kept, detached from the group.
class DeleteProductVariantGroupService {
    async execute({ id }: IDeleteProductVariantGroupRequest) {
        const existingGroup = await prismaClient.productVariantGroup.findUnique({
            where: { id },
        });

        if (!existingGroup) {
            throw new NotFoundException(
                "Variant group not found",
                ErrorCodes.PRODUCT_VARIANT_GROUP_NOT_FOUND
            );
        }

        try {
            await prismaClient.$transaction([
                prismaClient.product.updateMany({
                    where: { variant_group_id: id },
                    data: { variant_group_id: null, color_id: null, variant_order: 0 },
                }),
                prismaClient.productVariantGroup.delete({
                    where: { id },
                }),
            ]);

            return { message: "Variant group deleted successfully" };
        } catch (error: any) {
            console.error("[DeleteProductVariantGroupService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { DeleteProductVariantGroupService };
