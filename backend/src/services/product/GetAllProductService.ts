import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllProductService{
	async execute(page: number = 1, pageSize: number = 8, query?: string) {
		try {
			const skip = (page - 1) * pageSize;

			const filters = query
				? {
						name: {
							contains: query,
							mode: 'insensitive',
						},
						enabled: true
				}
				: { enabled: true };

			const [products, total] = await Promise.all([
				prismaClient.product.findMany({
					where: filters as any,
					skip,
					take: pageSize,
					select: {
						id: true,
						name: true,
						image: true,
						price: true,
						unity: true,
						stock: true,
						enabled: true
					},
					orderBy: {
						created_at: 'desc'
					}
				}),
				prismaClient.product.count({
					where: filters as any,
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

export { GetAllProductService }
