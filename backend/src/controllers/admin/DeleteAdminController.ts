import {Request, Response} from 'express'
import { DeleteAdminService } from '../../services/admin/DeleteAdminService'

class DeleteAdminController{
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const deleteAdminService = new DeleteAdminService();

    const admin = await deleteAdminService.execute(id);

    return res.json(admin)
  }
}

export { DeleteAdminController }
