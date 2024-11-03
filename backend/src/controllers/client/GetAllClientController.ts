import {Request, Response} from 'express'
import { GetAllClientService } from '../../services/client/GetAllClientService';

class GetAllClientController{
  async handle(req: Request, res: Response) {
    const getAllClientService = new GetAllClientService();
    const clients = await getAllClientService.execute();

    return res.json(clients);
  }
}

export { GetAllClientController }