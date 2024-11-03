import {Request, Response} from 'express'
import { GetAllAdminService } from '../../services/admin/GetAllAdminService';

class GetAllAdminController{
  async handle(req: Request, res: Response) {
    const getAllAdminService = new GetAllAdminService();
    const admins = await getAllAdminService.execute();

    return res.json(admins);
  }
}

export { GetAllAdminController }