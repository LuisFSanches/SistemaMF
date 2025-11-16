import { Request, Response, NextFunction } from 'express';
import { CreateSupplierService } from '../../services/supplier/CreateSupplierService';

class CreateSupplierController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;

        const createSupplierService = new CreateSupplierService();

        const supplier = await createSupplierService.execute({
            name
        });
        
        return res.json(supplier);
    }
}

export { CreateSupplierController };
