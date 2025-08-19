import {Request, Response} from 'express'

class GetAdminController{
    async handle(req: Request, res: Response) {
        return res.json(req.admin)
    }
}

export { GetAdminController }