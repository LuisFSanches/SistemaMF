import {Request, Response} from 'express'
import { GetAllClientAddressService } from '../../services/address/GetAllClientAddressService';

class GetAllClientAddressController{
  async handle(req: Request, res: Response) {
    const { client_id } = req.params;

    const getAllClientAddressService = new GetAllClientAddressService();
    const addresses = await getAllClientAddressService.execute(client_id);

    return res.json(addresses);
  }
}

export { GetAllClientAddressController }