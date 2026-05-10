import { Request, Response } from 'express'
import { DashboardService } from '../../services/dashboard/DashboardService'
import { BadRequestException } from '../../exceptions/bad-request'
import { ErrorCodes } from '../../exceptions/root'

export class DashboardController {
    async handle(req: Request, res: Response) {
        const { startDate, endDate } = req.query;
        const store_id = req.admin?.store_id || undefined;
        console.log("Store ID no DashboardController:", store_id);

        // Validação das datas
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                error: 'startDate e endDate são obrigatórios' 
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        // Validação se as datas são válidas
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ 
                error: 'Datas inválidas. Use o formato YYYY-MM-DD' 
            });
        }

        // Validação se startDate é anterior a endDate
        if (start > end) {
            return res.status(400).json({ 
                error: 'startDate deve ser anterior a endDate' 
            });
        }

        try {
            const data = await DashboardService.getDashboardData(start, end, store_id);
            return res.json(data)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: 'Erro ao carregar o dashboard.' })
        }
    }
}
