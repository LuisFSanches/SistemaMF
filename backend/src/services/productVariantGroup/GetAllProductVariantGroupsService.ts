import { Prisma } from "@prisma/client";
import prismaClient from "../../prisma";
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { PRODUCT_VARIANT_GROUP_INCLUDE } from "./productVariantGroupInclude";

interface IGetAllProductVariantGroupsRequest {
    page?: number
    pageSize?: number
    query?: string
}

class GetAllProductVariantGroupsService {
    async execute({ page = 1, pageSize = 20, query }: IGetAllProductVariantGroupsRequest) {
        const where: Prisma.ProductVariantGroupWhereInput = query && query.trim()
            ? {
                OR: [
                    { name: { contains: query.trim(), mode: 'insensitive' } },
                    { products: { some: { name: { contains: query.trim(), mode: 'insensitive' } } } },
                ]
            }
            : {};

        try {
            const [groups, total] = await Promise.all([
                prismaClient.productVariantGroup.findMany({
                    where,
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    orderBy: { name: 'asc' },
                    include: PRODUCT_VARIANT_GROUP_INCLUDE,
                }),
                prismaClient.productVariantGroup.count({ where }),
            ]);

            return {
                groups,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };
        } catch (error: any) {
            console.error("[GetAllProductVariantGroupsService] Failed:", error);

            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            );
        }
    }
}

export { GetAllProductVariantGroupsService };
