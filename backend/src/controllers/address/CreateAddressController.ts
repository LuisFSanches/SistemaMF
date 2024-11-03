import { Request, Response } from 'express'
import { CreateAddressService } from '../../services/address/CreateAddressService'

class CreateAddressController{
  async handle(req: Request, res: Response) {
    const { client_id, street, city, state, postal_code, country } = req.body;

    const createAddressService = new CreateAddressService();

    const address = await createAddressService.execute({
      client_id, street, city, state, postal_code, country
    });
    

    return res.json(address)
  }
}

export { CreateAddressController }