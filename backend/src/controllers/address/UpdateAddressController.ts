import {Request, Response, NextFunction} from 'express'
import { UpdateAddressService } from '../../services/address/UpdateAddressService'

class UpdateAddressController{
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id, client_id, street, city, state, postal_code, country } = req.body;

    const updateAddressService = new UpdateAddressService();

    const { status, address } = await updateAddressService.execute({
      id,
      client_id,
      street,
      city,
      state,
      postal_code,
      country
    });
    

    return res.json({ status, address })
  }
}

export { UpdateAddressController }