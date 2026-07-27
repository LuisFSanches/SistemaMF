import { Request, Response, NextFunction } from 'express';
import { GetProduct3DModelService } from '../../services/product3dModel/GetProduct3DModelService';

class GetProduct3DModelController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const getProduct3DModelService = new GetProduct3DModelService();
        const model = await getProduct3DModelService.execute(id);

        return res.json(model);
    }
}

export { GetProduct3DModelController };
