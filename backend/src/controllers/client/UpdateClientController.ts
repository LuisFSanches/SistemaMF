import {Request, Response, NextFunction} from 'express'
import { UpdateClientService } from '../../services/client/UpdateClientService'

class UpdateClientController{
  async handle(req: Request, res: Response, next: NextFunction) {
    const { id, first_name, last_name, phone_number } = req.body;

    console.log('FIRST_NAME', first_name)

    const updateClientService = new UpdateClientService();

    const { status, client } = await updateClientService.execute({
      id,
      first_name,
      last_name,
      phone_number
    });
    

    return res.json({ status, client })
  }
}

export { UpdateClientController }