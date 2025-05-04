import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

class GetAllOrderService {
    async execute(page: number = 1, pageSize: number = 10) {
        try {
            const skip = (page - 1) * pageSize;

            const [orders, total] = await Promise.all([
                prismaClient.order.findMany({
                    include: {
                        client: true,
                        clientAddress: true,
                        createdBy: true,
                        orderItems: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: {
                        code: 'desc'
                    },
                    skip,
                    take: pageSize
                }),
                prismaClient.order.count()
            ]);

            return {
                orders,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };

        } catch (error: any) {
            return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR };
        }
    }
}

export { GetAllOrderService }
