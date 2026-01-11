import { Request, Response, NextFunction } from 'express';
import { CreateStoreAddressService } from '../../services/storeAddress/CreateStoreAddressService';

class CreateStoreAddressController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { 
            store_id, 
            street, 
            street_number, 
            complement, 
            neighborhood, 
            reference_point, 
            city, 
            state, 
            postal_code, 
            country,
            is_main 
        } = req.body;

        const createStoreAddressService = new CreateStoreAddressService();

        const address = await createStoreAddressService.execute({
            store_id,
            street,
            street_number,
            complement,
            neighborhood,
            reference_point,
            city,
            state,
            postal_code,
            country,
            is_main,
        });
        
        return res.json(address);
    }
}

export { CreateStoreAddressController };
