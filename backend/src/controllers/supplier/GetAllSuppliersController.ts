import { Request, Response, NextFunction } from 'express';
import { GetAllSuppliersService } from '../../services/supplier/GetAllSuppliersService';

class GetAllSuppliersController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const getAllSuppliersService = new GetAllSuppliersService();

        const suppliers = await getAllSuppliersService.execute();

        return res.json(suppliers);
    }
}

export { GetAllSuppliersController };
