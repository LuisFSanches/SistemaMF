import {Request, Response, NextFunction} from 'express'
import { UpdateAddressService } from '../../services/address/UpdateAddressService'

class UpdateAddressController{
    async handle(req: Request, res: Response, next: NextFunction) {
        const { data } = req.body;

        const updateAddressService = new UpdateAddressService();

        const address = await updateAddressService.execute(data);
        
        return res.json({ status, address })
    }
}

export { UpdateAddressController }