import { Request, Response, NextFunction } from 'express';
import { ExportStoreProductsToExcelService } from '../../services/product/ExportStoreProductsToExcelService';

class ExportStoreProductsToExcelController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { storeId } = req.query;

        if (!storeId || typeof storeId !== 'string') {
            return res.status(400).json({ 
                error: 'storeId é obrigatório' 
            });
        }

        const exportStoreProductsToExcelService = new ExportStoreProductsToExcelService();

        const result = await exportStoreProductsToExcelService.execute({ 
            storeId 
        });

        // Configurar headers para download do arquivo
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${result.filename}"`
        );

        return res.send(result.buffer);
    }
}

export { ExportStoreProductsToExcelController };
