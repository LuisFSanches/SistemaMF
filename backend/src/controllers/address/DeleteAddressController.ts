import {Request, Response} from 'express'
import { DeleteAddressService } from '../../services/address/DeleteAddressService'

class DeleteAddressController{
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteAddressService = new DeleteAddressService();

    const address = await deleteAddressService.execute(id);

    return res.json(address)
  }
}

export { DeleteAddressController }
