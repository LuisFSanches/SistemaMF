import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";

  class GetAllOrderService{
    async execute() {
      try {
        const orders = await prismaClient.order.findMany({
          include: {
            client: true,
            clientAddress: true,
            createdBy: true
          },
          orderBy: {
            code: 'desc'
          }
        });

        return { orders };

      } catch(error: any) {
        return { error: true, message: error.message, code: ErrorCodes.SYSTEM_ERROR }
      }
    }
  }
  
  export { GetAllOrderService }
