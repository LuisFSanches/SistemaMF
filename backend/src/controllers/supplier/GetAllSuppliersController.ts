import { Request, Response, NextFunction } from 'express';
import { GetAllSuppliersService } from '../../services/supplier/GetAllSuppliersService';

class GetAllSuppliersController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const store_id = req.admin?.store_id || undefined;
        const getAllSuppliersService = new GetAllSuppliersService();

        const suppliers = await getAllSuppliersService.execute(store_id);

        return res.json(suppliers);
    }
}

export { GetAllSuppliersController };
