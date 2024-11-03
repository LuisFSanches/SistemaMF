import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from "../../exceptions/bad-request";
import { CreateAdminService } from '../../services/admin/CreateAdminService';

class CreateAdminController{
  async handle(req: Request, res: Response, next: NextFunction) {
    const { username, name, password, role } = req.body;

    const createAdminService = new CreateAdminService();

    const admin = await createAdminService.execute({
      username,
      name,
      password,
      role
    });

    if (admin.error) {
      next(new BadRequestException(
        admin.message,
        admin.code
      ))
    }

    return res.json(admin)
  }
}

export { CreateAdminController }
