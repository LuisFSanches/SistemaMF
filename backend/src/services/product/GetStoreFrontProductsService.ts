import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetStoreFrontProductsService{
	async execute(page: number = 1, pageSize: number = 8, query?: string) {
		try {
			const skip = (page - 1) * pageSize;

			if (query && query.trim()) {
				const searchTerms = query.trim().split(/\s+/).filter(term => term.length > 0);
				
				const conditions = searchTerms.map((_, index) => 
					`replace(unaccent(lower(name)), ' ', '') LIKE '%' || replace(unaccent(lower($${index + 1})), ' ', '') || '%'`
				).join(' AND ');

				const products = await prismaClient.$queryRawUnsafe<any[]>(
					`
						SELECT id, name, image, price, unity, stock, enabled, qr_code
						FROM "products"
						WHERE enabled = true
						AND visible_in_store = true
						AND ${conditions}
						ORDER BY created_at DESC
						LIMIT $${searchTerms.length + 1} OFFSET $${searchTerms.length + 2}
					`,
					...searchTerms,
					pageSize,
					skip
				);

				const totalResult = await prismaClient.$queryRawUnsafe<{ count: bigint }[]>(
					`
						SELECT COUNT(*) as count
						FROM "products"
						WHERE enabled = true
						AND visible_in_store = true
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

			const [products, total] = await Promise.all([
				prismaClient.product.findMany({
					where: { 
						enabled: true,
						visible_in_store: true
					},
					skip,
					take: pageSize,
					select: {
						id: true,
						name: true,
						image: true,
						price: true,
						unity: true,
						stock: true,
						enabled: true,
						qr_code: true
					},
					orderBy: {
						created_at: 'desc'
					}
				}),
				prismaClient.product.count({
					where: { 
						enabled: true,
						visible_in_store: true
					},
				}),
			]);

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

export { GetStoreFrontProductsService }
