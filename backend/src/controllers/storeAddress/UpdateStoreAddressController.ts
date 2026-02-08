import { Request, Response, NextFunction } from 'express';
import { UpdateStoreAddressService } from '../../services/storeAddress/UpdateStoreAddressService';

class UpdateStoreAddressController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const data = req.body;

        const updateStoreAddressService = new UpdateStoreAddressService();

        const address = await updateStoreAddressService.execute({
            id,
            ...data,
        });
        
        return res.json(address);
    }
}

export { UpdateStoreAddressController };
