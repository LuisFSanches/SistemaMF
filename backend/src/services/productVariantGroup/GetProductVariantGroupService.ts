import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { NotFoundException } from "../../exceptions/not-found";
import { PRODUCT_VARIANT_GROUP_INCLUDE } from "./productVariantGroupInclude";

interface IGetProductVariantGroupRequest {
    id: string
}

class GetProductVariantGroupService {
    async execute({ id }: IGetProductVariantGroupRequest) {
        const group = await prismaClient.productVariantGroup.findUnique({
            where: { id },
            include: PRODUCT_VARIANT_GROUP_INCLUDE,
        });

        if (!group) {
            throw new NotFoundException(
                "Variant group not found",
                ErrorCodes.PRODUCT_VARIANT_GROUP_NOT_FOUND
            );
        }

        return group;
    }
}

export { GetProductVariantGroupService };
