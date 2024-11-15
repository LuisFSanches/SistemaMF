import {Request, Response} from 'express'
import { GetAllOrderService } from '../../services/order/GetAllOrderService';

class GetAllOrderController{
  async handle(req: Request, res: Response) {
    const getAllOrderService = new GetAllOrderService();
    const orders = await getAllOrderService.execute();

    return res.json(orders);
  }
}

export { GetAllOrderController }
