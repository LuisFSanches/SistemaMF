import {Request, Response} from 'express'
import { GetAllClientService } from '../../services/client/GetAllClientService';

class GetAllClientController{
    async handle(req: Request, res: Response) {
        const { page = '1', pageSize = '10' } = req.query;
        const getAllClientService = new GetAllClientService();
        const clients = await getAllClientService.execute(Number(page), Number(pageSize));

        return res.json(clients);
    }
}

export { GetAllClientController }