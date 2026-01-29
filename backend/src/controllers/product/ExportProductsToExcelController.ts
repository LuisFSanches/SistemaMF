import { Request, Response, NextFunction } from 'express';
import { ExportProductsToExcelService } from '../../services/product/ExportProductsToExcelService';

class ExportProductsToExcelController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { storeId } = req.query;

        if (!storeId || typeof storeId !== 'string') {
            return res.status(400).json({ 
                error: 'storeId é obrigatório' 
            });
        }

        const exportProductsToExcelService = new ExportProductsToExcelService();

        const result = await exportProductsToExcelService.execute({ 
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

export { ExportProductsToExcelController };
