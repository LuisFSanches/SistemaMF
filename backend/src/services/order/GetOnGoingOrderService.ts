import prismaClient from '../../prisma';

class GetOnGoingOrderService {
    async execute() {
        const orders = await prismaClient.order.findMany({
            where: {
                status: {
                    notIn: ['FINISHED', 'CANCELED', 'DONE']
                }
            },
            orderBy: {
                code: 'desc'
            },
            include: {
                client: true,
                clientAddress: true,
                createdBy: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        
        return orders;
    }
}

export { GetOnGoingOrderService };
