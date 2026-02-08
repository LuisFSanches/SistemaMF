import { Request, Response } from 'express'
import { DashboardService } from '../../services/dashboard/DashboardService'

export class DashboardController {
    async handle(req: Request, res: Response) {
        const period = (req.query.period as 'week' | 'month' | 'year') || 'week'
        const store_id = req.admin?.store_id || undefined;
        console.log("Store ID no GetOnGoingOrderController:", store_id);

        try {
            const data = await DashboardService.getDashboardData(period, store_id);
            return res.json(data)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: 'Erro ao carregar o dashboard.' })
        }
    }
}
