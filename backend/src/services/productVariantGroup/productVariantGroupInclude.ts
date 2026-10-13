import { Prisma } from "@prisma/client";

// Shared shape returned by every variant group endpoint
export const PRODUCT_VARIANT_GROUP_INCLUDE = {
    products: {
        orderBy: [{ variant_order: 'asc' }, { name: 'asc' }],
        select: {
            id: true,
            name: true,
            price: true,
            image: true,
            enabled: true,
            sales_count: true,
            variant_order: true,
            color: {
                select: { id: true, name: true, hex: true, is_mixed: true },
            },
        },
    },
} satisfies Prisma.ProductVariantGroupInclude;
