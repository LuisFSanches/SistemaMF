import prismaClient from "../prisma";
import { IStoreProductVariant } from "../interfaces/IProductVariantGroup";

interface ILoadStoreProductVariantsOptions {
    // Storefront: only variants visible in the online store; out of stock ones are returned as unavailable
    onlineOnly?: boolean
}

// Loads, for one store, the colors available for each variant group.
// Returns a map of variant_group_id -> variants sorted by variant_order / color sort_order.
export async function loadStoreProductVariants(
    storeId: string,
    groupIds: string[],
    { onlineOnly = false }: ILoadStoreProductVariantsOptions = {}
): Promise<Map<string, IStoreProductVariant[]>> {
    const variantsByGroup = new Map<string, IStoreProductVariant[]>();
    const uniqueGroupIds = [...new Set(groupIds.filter(Boolean))];

    if (uniqueGroupIds.length === 0) {
        return variantsByGroup;
    }

    const storeProducts = await prismaClient.storeProduct.findMany({
        where: {
            store_id: storeId,
            enabled: true,
            ...(onlineOnly ? { visible_for_online_store: true } : {}),
            product: {
                variant_group_id: { in: uniqueGroupIds },
                enabled: true,
            },
        },
        select: {
            id: true,
            price: true,
            stock: true,
            image: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    variant_group_id: true,
                    variant_order: true,
                    color: {
                        select: { id: true, name: true, hex: true, is_mixed: true, sort_order: true },
                    },
                },
            },
        },
    });

    const sorted = [...storeProducts].sort((a, b) =>
        a.product.variant_order - b.product.variant_order
        || (a.product.color?.sort_order ?? 0) - (b.product.color?.sort_order ?? 0)
        || a.product.name.localeCompare(b.product.name)
    );

    for (const storeProduct of sorted) {
        const groupId = storeProduct.product.variant_group_id as string;
        const color = storeProduct.product.color;

        const variant: IStoreProductVariant = {
            id: storeProduct.id,
            product_id: storeProduct.product.id,
            name: storeProduct.product.name,
            price: storeProduct.price,
            stock: storeProduct.stock,
            image: storeProduct.image || storeProduct.product.image,
            // The PDV does not block sales by stock, the storefront does
            available: onlineOnly ? storeProduct.stock > 0 : true,
            variant_order: storeProduct.product.variant_order,
            color: color
                ? { id: color.id, name: color.name, hex: color.hex, is_mixed: color.is_mixed }
                : null,
        };

        variantsByGroup.set(groupId, [...(variantsByGroup.get(groupId) || []), variant]);
    }

    return variantsByGroup;
}

// SQL condition that matches a search term against the product name OR its variant group name.
// `paramIndex` is the positional parameter holding the term.
export function variantAwareNameCondition(paramIndex: number) {
    const normalizedTerm = `replace(unaccent(lower($${paramIndex})), ' ', '')`;

    return `(
        replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || ${normalizedTerm} || '%'
        OR replace(unaccent(lower(COALESCE(g.name, ''))), ' ', '') LIKE '%' || ${normalizedTerm} || '%'
    )`;
}
