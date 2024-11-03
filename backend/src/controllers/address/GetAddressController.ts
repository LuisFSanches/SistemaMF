import {Request, Response} from 'express'
import { GetAddressService } from '../../services/address/GetAddressService'

class GetAddressController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getAddressService = new GetAddressService();

    const address = await getAddressService.execute(id);

    return res.json(address)
  }
}

export { GetAddressController }
