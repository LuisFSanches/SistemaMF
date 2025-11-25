import {Request, Response, NextFunction} from 'express'
import { GetClientService } from '../../services/client/GetClientService'

class GetClientController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getClientService = new GetClientService();

        const clientData = await getClientService.execute(id);

        return res.json(clientData)
    }
}

export { GetClientController }
