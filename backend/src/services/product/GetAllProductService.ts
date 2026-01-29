import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllProductService{
	async execute(page: number = 1, pageSize: number = 8, query?: string, storeId?: string) {
		try {
			const skip = (page - 1) * pageSize;

			if (query && query.trim()) {
				const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
				
				const conditions = searchTerms.map((_, index) => 
					`replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
				).join(' AND ');

				const storeCondition = storeId 
					? `AND NOT EXISTS (SELECT 1 FROM "store_products" sp WHERE sp.product_id = p.id AND sp.store_id = $${searchTerms.length + 1})`
					: '';

				const queryParams = storeId 
					? [...searchTerms, storeId, pageSize, skip]
					: [...searchTerms, pageSize, skip];

				const limitOffset = storeId 
					? `$${searchTerms.length + 2} OFFSET $${searchTerms.length + 3}`
					: `$${searchTerms.length + 1} OFFSET $${searchTerms.length + 2}`;

				const productsRaw = await prismaClient.$queryRawUnsafe<any[]>(
					`
						SELECT p.id, p.name, p.image, p.price, p.unity, p.stock, p.enabled, p.qr_code, p.visible_in_store, p.sales_count
						FROM "products" p
						WHERE p.enabled = true
						AND ${conditions}
						${storeCondition}
						ORDER BY p.sales_count DESC, p.created_at DESC
						LIMIT ${limitOffset}
					`,
					...queryParams
				);

				const products = productsRaw.map(product => ({
					...product,
					sales_count: Number(product.sales_count)
				}));

				const totalQueryParams = storeId ? [...searchTerms, storeId] : searchTerms;

				const totalResult = await prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
					`
						SELECT COUNT(*) as count
						FROM "products" p
						WHERE p.enabled = true
						AND ${conditions}
						${storeCondition}
					`,
					...totalQueryParams
				);

				const total = Number(totalResult[0].count);

				return {
					products,
					total,
					currentPage: page,
					totalPages: Math.ceil(total / pageSize)
				};
			}

			let productsRaw: any[];
			let total: number;

			if (storeId) {
				[productsRaw, total] = await Promise.all([
					prismaClient.$queryRawUnsafe<any[]>(
						`
							SELECT p.id, p.name, p.image, p.price, p.unity, p.stock, p.enabled, p.qr_code, p.visible_in_store, p.sales_count
							FROM "products" p
							WHERE p.enabled = true
							AND NOT EXISTS (
								SELECT 1 FROM "store_products" sp 
								WHERE sp.product_id = p.id AND sp.store_id = $1
							)
							ORDER BY p.sales_count DESC, p.created_at DESC
							LIMIT $2 OFFSET $3
						`,
						storeId,
						pageSize,
						skip
					),
					prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
						`
							SELECT COUNT(*) as count
							FROM "products" p
							WHERE p.enabled = true
							AND NOT EXISTS (
								SELECT 1 FROM "store_products" sp 
								WHERE sp.product_id = p.id AND sp.store_id = $1
							)
						`,
						storeId
					).then(result => Number(result[0].count))
				]);
			} else {
				[productsRaw, total] = await Promise.all([
					prismaClient.$queryRaw<any[]>`
						SELECT p.id, p.name, p.image, p.price, p.unity, p.stock, p.enabled, p.qr_code, p.visible_in_store, p.sales_count
						FROM "products" p
						WHERE p.enabled = true
						ORDER BY p.sales_count DESC, p.created_at DESC
						LIMIT ${pageSize} OFFSET ${skip}
					`,
					prismaClient.product.count({
						where: { enabled: true },
					}),
				]);
			}

			const products = productsRaw.map(product => ({
				...product,
				sales_count: Number(product.sales_count)
			}));

			return {
				products,
				total,
				currentPage: page,
				totalPages: Math.ceil(total / pageSize)
			};

			} catch(error: any) {
				throw new BadRequestException(
					error.message,
					ErrorCodes.SYSTEM_ERROR
				);
			}
		}
	}

export { GetAllProductService }
