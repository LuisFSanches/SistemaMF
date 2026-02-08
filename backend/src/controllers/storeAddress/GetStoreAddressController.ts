import { Request, Response, NextFunction } from 'express';
import { GetStoreAddressService } from '../../services/storeAddress/GetStoreAddressService';

class GetStoreAddressController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getStoreAddressService = new GetStoreAddressService();

        const address = await getStoreAddressService.execute({ id });
        
        return res.json(address);
    }
}

export { GetStoreAddressController };
