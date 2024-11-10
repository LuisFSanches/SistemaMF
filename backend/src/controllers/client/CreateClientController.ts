import {Request, Response, NextFunction} from 'express'
import { BadRequestException } from "../../exceptions/bad-request";
import { CreateClientService } from '../../services/client/CreateClientService'

class CreateClientController{
  async handle(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name, phone_number } = req.body;

    const createClientService = new CreateClientService();

    const client = await createClientService.execute({
      first_name,
      last_name,
      phone_number
    });
    
    if ('error' in client && client.error) {
      next(new BadRequestException(
        client.message,
        client.code
      ));
    }
    
    return res.json(client)
  }
}

export { CreateClientController }