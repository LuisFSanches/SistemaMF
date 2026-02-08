import { Request, Response, NextFunction } from 'express';
import { GetAllStoresForSysAdminService } from '../../services/admin/GetAllStoresForSysAdminService';

class GetAllStoresForSysAdminController {
    async handle(req: Request, res: Response, next: NextFunction) {
        // Instanciar o service
        const getAllStoresForSysAdminService = new GetAllStoresForSysAdminService();

        // Executar a lógica de negócio
        const result = await getAllStoresForSysAdminService.execute();
        
        // Retornar resposta
        return res.json(result);
    }
}

export { GetAllStoresForSysAdminController };
