import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class TopClientsService{
    async execute(initial_date: any, final_date: any, limit: any) {
		const start = new Date(initial_date);
      	const end = new Date(final_date);

        try {
            const topClients = await prismaClient.order.groupBy({
				by: ["client_id"],
				where: {
					created_at: {
						gte: start,
						lte: end,
					},
				},
				_count: {
					id: true,
				},
				orderBy: {
					_count: {
					id: "desc",
					},
				},
				take: parseInt(limit),
			});
			
			const result = await Promise.all(
				topClients.map(async (item) => {
					const client = await prismaClient.client.findUnique({
						where: { id: item.client_id },
						select: {
							first_name: true,
							last_name: true,
							phone_number: true,
						},
					});
					return {
						...client,
						totalOrders: item._count.id,
					};
				})
			);
	
			return result;

        } catch(error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
        }
    }
}

export { TopClientsService }