import {NextFunction, Request, Response} from 'express'
import { BadRequestException } from "../../exceptions/bad-request";
import { LoginAdminService } from '../../services/admin/LoginAdminService'

class LoginAdminController{
  async handle(req: Request, res: Response, next: NextFunction) {
    const { username, name, password, role } = req.body;

    const loginAdminService = new LoginAdminService();

    const login = await loginAdminService.execute({
      username,
      name,
      password,
      role,
    });

    if (login.error) {
      next(new BadRequestException(
        login.message,
        login.code
      ))
    }

    return res.json(login)
  }
}

export { LoginAdminController }