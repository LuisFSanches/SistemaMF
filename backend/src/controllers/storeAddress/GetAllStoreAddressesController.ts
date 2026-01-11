import { Request, Response, NextFunction } from 'express';
import { GetAllStoreAddressesService } from '../../services/storeAddress/GetAllStoreAddressesService';

class GetAllStoreAddressesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { store_id } = req.params;

        const getAllStoreAddressesService = new GetAllStoreAddressesService();

        const addresses = await getAllStoreAddressesService.execute({ store_id });
        
        return res.json(addresses);
    }
}

export { GetAllStoreAddressesController };
