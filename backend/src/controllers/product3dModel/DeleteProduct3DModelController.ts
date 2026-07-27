import { Request, Response, NextFunction } from 'express';
import { DeleteProduct3DModelService } from '../../services/product3dModel/DeleteProduct3DModelService';

class DeleteProduct3DModelController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const deleteProduct3DModelService = new DeleteProduct3DModelService();
        const result = await deleteProduct3DModelService.execute(id);

        return res.json(result);
    }
}

export { DeleteProduct3DModelController };
