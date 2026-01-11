import { Request, Response, NextFunction } from 'express';
import { CreateStoreService } from '../../services/store/CreateStoreService';

class CreateStoreController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { 
            name, 
            slug, 
            cnpj, 
            phone_number, 
            email,
            description,
            is_active
        } = req.body;

        const createStoreService = new CreateStoreService();

        const store = await createStoreService.execute({
            name,
            slug,
            cnpj,
            phone_number,
            email,
            description,
            is_active,
        });

        return res.json(store);
    }
}

export { CreateStoreController };
