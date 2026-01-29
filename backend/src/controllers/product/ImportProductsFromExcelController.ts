import { Request, Response, NextFunction } from 'express';
import { ImportProductsFromExcelService } from '../../services/product/ImportProductsFromExcelService';

class ImportProductsFromExcelController {
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

        const importProductsFromExcelService = new ImportProductsFromExcelService();

        const result = await importProductsFromExcelService.execute({
            storeId,
            buffer: req.file.buffer
        });

        return res.json(result);
    }
}

export { ImportProductsFromExcelController };
