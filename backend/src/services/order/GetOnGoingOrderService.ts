import prismaClient from '../../prisma';

class GetOnGoingOrderService {
  async execute() {
    const orders = await prismaClient.order.findMany({
      where: {
        status: {
          notIn: ['FINISHED', 'CANCELED']
        }
      },
      include: {
        client: true,
        clientAddress: true,
        createdBy: true
      }
    });
    
    return orders;
  }
}

export { GetOnGoingOrderService };

