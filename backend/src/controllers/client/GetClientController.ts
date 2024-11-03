import {Request, Response} from 'express'
import { GetClientService } from '../../services/client/GetClientService'

class GetClientController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getAdminService = new GetClientService();

    const client = await getAdminService.execute(id);

    return res.json(client)
  }
}

export { GetClientController }
