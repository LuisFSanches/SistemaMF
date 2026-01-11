import { Request, Response, NextFunction } from 'express';
import { UpdateStoreProductsFromExcelService } from '../../services/product/UpdateStoreProductsFromExcelService';

class UpdateStoreProductsFromExcelController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { storeId } = req.body;

        if (!storeId) {
            return res.status(400).json({ 
                error: 'storeId é obrigatório' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                error: 'Arquivo Excel é obrigatório' 
            });
        }

        const updateStoreProductsFromExcelService = new UpdateStoreProductsFromExcelService();

        const result = await updateStoreProductsFromExcelService.execute({
            storeId,
            buffer: req.file.buffer
        });

        return res.json(result);
    }
}

export { UpdateStoreProductsFromExcelController };
