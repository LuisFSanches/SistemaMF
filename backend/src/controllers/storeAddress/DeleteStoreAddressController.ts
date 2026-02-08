import { Request, Response, NextFunction } from 'express';
import { DeleteStoreAddressService } from '../../services/storeAddress/DeleteStoreAddressService';

class DeleteStoreAddressController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteStoreAddressService = new DeleteStoreAddressService();

        const result = await deleteStoreAddressService.execute({ id });
        
        return res.json(result);
    }
}

export { DeleteStoreAddressController };
