import {Request, Response} from 'express'
import { DeleteClientService } from '../../services/client/DeleteClientService'

class DeleteClientController{
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteClientService = new DeleteClientService();

    const client = await deleteClientService.execute(id);

    return res.json(client)
  }
}

export { DeleteClientController }
