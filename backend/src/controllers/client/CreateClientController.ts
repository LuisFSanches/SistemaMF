import {Request, Response, NextFunction} from 'express'
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
        
        return res.json(client)
    }
}

export { CreateClientController }