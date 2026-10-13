import { Request, Response, NextFunction } from 'express';
import { GetAllProductColorsService } from '../../services/productColor/GetAllProductColorsService';

class GetAllProductColorsController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const getAllProductColorsService = new GetAllProductColorsService();

        const colors = await getAllProductColorsService.execute();

        return res.json(colors);
    }
}

export { GetAllProductColorsController };
