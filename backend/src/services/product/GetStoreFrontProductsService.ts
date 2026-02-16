import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";
import { NotFoundException } from "../../exceptions/not-found";

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

			if (query && query.trim()) {
				const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
				
				const conditions = searchTerms.map((_, index) => 
					`replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 2})), ' ', '') || '%'`
				).join(' AND ');

				// Adicionar filtro de categoria se fornecido
				const categoryJoin = categoryId ? 
					'INNER JOIN "product_categories" pc ON pc.product_id = p.id' : '';
				const categoryCondition = categoryId ? 
					`AND pc.category_id = $${searchTerms.length + 2}` : '';

				const queryParams = categoryId ? 
					[store.id, ...searchTerms, categoryId, pageSize, skip] :
					[store.id, ...searchTerms, pageSize, skip];

				const limitOffset = categoryId ?
					`LIMIT $${searchTerms.length + 3} OFFSET $${searchTerms.length + 4}` :
					`LIMIT $${searchTerms.length + 2} OFFSET $${searchTerms.length + 3}`;

				const products = await prismaClient.$queryRawUnsafe<any[]>(
					`
						SELECT DISTINCT
							sp.id, 
							p.name, 
							p.image, 
							sp.price, 
							p.unity, 
							sp.stock, 
							sp.enabled, 
							p.qr_code,
							p.created_at
						FROM "store_products" sp
						INNER JOIN "products" p ON p.id = sp.product_id
						${categoryJoin}
						WHERE sp.store_id = $1
						AND sp.enabled = true
						AND sp.visible_for_online_store = true
						AND ${conditions}
						${categoryCondition}
						ORDER BY p.created_at DESC
						${limitOffset}
					`,
					...queryParams
				);

				const totalQueryParams = categoryId ? 
					[store.id, ...searchTerms, categoryId] :
					[store.id, ...searchTerms];

				const totalResult = await prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
					`
						SELECT COUNT(DISTINCT sp.id) as count
						FROM "store_products" sp
						INNER JOIN "products" p ON p.id = sp.product_id
						${categoryJoin}
						WHERE sp.store_id = $1
						AND sp.enabled = true
						AND sp.visible_for_online_store = true
						AND ${conditions}
						${categoryCondition}
					`,
					...totalQueryParams
				);

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
						schedules: store.schedules,
						addresses: store.addresses,
						google_rating_value: store.google_rating_value,
						google_rating_count: store.google_rating_count,
						google_rating_url: store.google_rating_url,
						phone_number: store.phone_number,
					}
				};
			}

			// Buscar produtos da loja através da tabela store_products
			const whereCondition: any = { 
				store_id: store.id,
				enabled: true,
				visible_for_online_store: true
			};

			// Adicionar filtro de categoria se fornecido
			if (categoryId) {
				whereCondition.product = {
					categories: {
						some: {
							category_id: categoryId
						}
					}
				};
			}

			const [storeProducts, total] = await Promise.all([
				prismaClient.storeProduct.findMany({
					where: whereCondition,
					skip,
					take: pageSize,
					select: {
						id: true,
						price: true,
						stock: true,
						enabled: true,
						product: {
							select: {
								id: true,
								name: true,
								image: true,
								unity: true,
								qr_code: true
							}
						}
					},
					orderBy: {
						product: {
							created_at: 'desc'
						}
					}
				}),
				prismaClient.storeProduct.count({
					where: whereCondition,
				}),
			]);

			// Transformar os dados para o formato esperado pelo frontend
			const products = storeProducts.map(sp => ({
				id: sp.id, // ID do store_product (não do produto pai)
				name: sp.product.name,
				image: sp.product.image,
				price: sp.price,
				unity: sp.product.unity,
				stock: sp.stock,
				enabled: sp.enabled,
				qr_code: sp.product.qr_code
			}));

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
					schedules: store.schedules,
					addresses: store.addresses,
					google_rating_value: store.google_rating_value,
					google_rating_count: store.google_rating_count,
					google_rating_url: store.google_rating_url,
					phone_number: store.phone_number,
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
