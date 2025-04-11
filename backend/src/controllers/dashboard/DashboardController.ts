import { Request, Response } from 'express'
import { DashboardService } from '../../services/dashboard/DashboardService'

export class DashboardController {
    async handle(req: Request, res: Response) {
        const period = (req.query.period as 'week' | 'month' | 'year') || 'week'

        try {
            const data = await DashboardService.getDashboardData(period)
            return res.json(data)
        } catch (err) {
            console.error(err)
            return res.status(500).json({ error: 'Erro ao carregar o dashboard.' })
        }
    }
}
