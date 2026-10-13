import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";
import { loadStoreProductVariants, variantAwareNameCondition } from "../../utils/storeProductVariants";

class GetStoreFrontProductsService{
	async execute(storeSlug: string, page: number = 1, pageSize: number = 8, query?: string, categorySlug?: string) {
		try {
			// Buscar a loja pelo slug
			const store = await prismaClient.store.findUnique({
				where: { slug: storeSlug },
				include: {
					schedules: {
						orderBy: {
							day_of_week: 'asc'
						}
					},
					addresses: true
				}
			});

			if (!store) {
				throw new NotFoundException(
					'Store not found',
					ErrorCodes.USER_NOT_FOUND
				);
			}

			if (!store.is_active) {
				throw new BadRequestException(
					'Store is not active',
					ErrorCodes.BAD_REQUEST
				);
			}

			// Buscar categoria se categorySlug foi fornecido
			let categoryId: string | undefined;
			if (categorySlug && categorySlug.trim()) {
				const category = await prismaClient.category.findUnique({
					where: { slug: categorySlug.trim() }
				});

				if (category) {
					categoryId = category.id;
				}
			}

			const skip = (page - 1) * pageSize;

			const searchTerms = query && query.trim()
				? query.trim().split(/\s+/).filter(term => term.length > 0)
				: [];

			// Positional params: $1 = store id, then search terms, then category id (optional)
			const params: any[] = [store.id, ...searchTerms];

			const searchCondition = searchTerms
				.map((_, index) => `AND ${variantAwareNameCondition(index + 2)}`)
				.join(' ');

			let categoryCondition = '';
			if (categoryId) {
				params.push(categoryId);
				categoryCondition = `AND EXISTS (
					SELECT 1 FROM "product_categories" pc
					WHERE pc.product_id = p.id AND pc.category_id = $${params.length}
				)`;
			}

			const baseFrom = `
				FROM "store_products" sp
				INNER JOIN "products" p ON p.id = sp.product_id
				LEFT JOIN "product_variant_groups" g ON g.id = p.variant_group_id
				WHERE sp.store_id = $1
				AND sp.enabled = true
				AND sp.visible_for_online_store = true
				AND sp.stock > 0
				${searchCondition}
				${categoryCondition}
			`;

			// Colors of the same variant group are collapsed into one card:
			// the best-selling available color represents the group.
			const [rows, totalResult] = await Promise.all([
				prismaClient.$queryRawUnsafe<any[]>(
					`
						SELECT * FROM (
							SELECT
								sp.id,
								p.name,
								COALESCE(sp.image, p.image) as image,
								sp.price,
								p.unity,
								sp.stock,
								sp.enabled,
								p.qr_code,
								p.variant_group_id,
								g.name as variant_group_name,
								ROW_NUMBER() OVER (
									PARTITION BY COALESCE(p.variant_group_id, p.id)
									ORDER BY p.sales_count DESC, p.name ASC
								) as group_rank,
								MAX(p.created_at) OVER (
									PARTITION BY COALESCE(p.variant_group_id, p.id)
								) as group_created_at
							${baseFrom}
						) ranked
						WHERE ranked.group_rank = 1
						ORDER BY ranked.group_created_at DESC
						LIMIT $${params.length + 1} OFFSET $${params.length + 2}
					`,
					...params,
					pageSize,
					skip
				),
				prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
					`SELECT COUNT(DISTINCT COALESCE(p.variant_group_id, p.id)) as count ${baseFrom}`,
					...params
				),
			]);

			const variantsByGroup = await loadStoreProductVariants(
				store.id,
				rows.map(row => row.variant_group_id).filter(Boolean),
				{ onlineOnly: true }
			);

			// Transformar os dados para o formato esperado pelo frontend
			const products = rows.map(row => ({
				id: row.id, // ID do store_product (não do produto pai)
				name: row.name,
				image: row.image,
				price: row.price,
				unity: row.unity,
				stock: row.stock,
				enabled: row.enabled,
				qr_code: row.qr_code,
				variant_group: row.variant_group_id
					? { id: row.variant_group_id, name: row.variant_group_name }
					: null,
				variants: row.variant_group_id ? variantsByGroup.get(row.variant_group_id) || [] : [],
			}));

			const total = Number(totalResult[0].count);

			return {
				products,
				total,
				currentPage: page,
				totalPages: Math.ceil(total / pageSize),
				store: {
					id: store.id,
					name: store.name,
					slug: store.slug,
					logo: store.logo,
					banner: store.banner,
					banner_2: store.banner_2,
					banner_3: store.banner_3,
					banner_mobile: store.banner_mobile,
					banner_mobile_2: store.banner_mobile_2,
					banner_mobile_3: store.banner_mobile_3,
					schedules: store.schedules,
					addresses: store.addresses,
					google_rating_value: store.google_rating_value,
					google_rating_count: store.google_rating_count,
					google_rating_url: store.google_rating_url,
					phone_number: store.phone_number,
					max_delivery_days_advance: store.max_delivery_days_advance,
				}
			};

		} catch(error: any) {
			if (error instanceof NotFoundException || error instanceof BadRequestException) {
				throw error;
			}
			throw new BadRequestException(
				error.message,
				ErrorCodes.SYSTEM_ERROR
			);
		}
	}
}

export { GetStoreFrontProductsService }
