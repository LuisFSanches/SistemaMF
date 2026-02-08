import { Request, Response, NextFunction } from 'express';
import { SwitchStoreService } from '../../services/admin/SwitchStoreService';

class SwitchStoreController {
    async handle(req: Request, res: Response, next: NextFunction) {
        // Extrair dados do request
        const { store_id } = req.body;
        const sysAdminId = req.admin?.id;

        if (!sysAdminId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Instanciar o service
        const switchStoreService = new SwitchStoreService();

        // Executar a lógica de negócio
        const result = await switchStoreService.execute({
            store_id
        }, sysAdminId);
        
        // Retornar resposta
        return res.json(result);
    }
}

export { SwitchStoreController };
