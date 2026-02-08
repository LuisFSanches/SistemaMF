import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllProductService{
	async execute(page: number = 1, pageSize: number = 8, query?: string) {
		try {
			const skip = (page - 1) * pageSize;

			if (query && query.trim()) {
				const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
				
				const conditions = searchTerms.map((_, index) => 
					`replace(unaccent(lower(p.name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
				).join(' AND ');

				const queryParams = [...searchTerms, pageSize, skip];

				const productsRaw = await prismaClient.$queryRawUnsafe<any[]>(
					`
						SELECT p.id, p.name, p.image, p.price, p.unity, p.stock, p.enabled, p.qr_code, p.visible_in_store, p.sales_count, p.description
						FROM "products" p
						WHERE p.enabled = true
						AND ${conditions}
						ORDER BY p.sales_count DESC, p.created_at DESC
						LIMIT $${searchTerms.length + 1} OFFSET $${searchTerms.length + 2}
					`,
					...queryParams
				);

				const products = productsRaw.map(product => ({
					...product,
					sales_count: Number(product.sales_count)
				}));

				const totalResult = await prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
					`
						SELECT COUNT(*) as count
						FROM "products" p
						WHERE p.enabled = true
						AND ${conditions}
					`,
					...searchTerms
				);

				const total = Number(totalResult[0].count);

				return {
					products,
					total,
					currentPage: page,
					totalPages: Math.ceil(total / pageSize)
				};
			}

			const [productsRaw, total] = await Promise.all([
				prismaClient.$queryRaw<any[]>`
					SELECT p.id, p.name, p.image, p.price, p.unity, p.stock, p.enabled, p.qr_code, p.visible_in_store, p.sales_count, p.description
					FROM "products" p
					WHERE p.enabled = true
					ORDER BY p.sales_count DESC, p.created_at DESC
					LIMIT ${pageSize} OFFSET ${skip}
				`,
				prismaClient.product.count({
					where: { enabled: true },
				}),
			]);

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
