import {Request, Response} from 'express'
import { GetClientByPhoneNumberService } from '../../services/client/GetClientByPhoneNumberService'

class GetClientByPhoneNumbeController {
    async handle(req: Request, res: Response) {
        const { phone_number }: any = req.query;

        const getClientService = new GetClientByPhoneNumberService();

        const client = await getClientService.execute(phone_number);

        return res.json(client)
    }
}

export { GetClientByPhoneNumbeController }
