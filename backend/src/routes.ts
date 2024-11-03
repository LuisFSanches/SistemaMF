import { Router } from 'express';

import { CreateClientController } from './controllers/client/CreateClientController'
import { CreateAdminController } from './controllers/admin/CreateAdminController'
import { LoginAdminController } from './controllers/admin/LoginAdminController'
import { GetAdminController } from './controllers/admin/GetAdminController'
import { GetAllAdminController } from './controllers/admin/GetAllAdminController'
import { DeleteAdminController } from './controllers/admin/DeleteAdminController'

import adminAuthMiddleware from './middlewares/admin_auth';
import superAdminAuthMiddleware from './middlewares/super_admin_auth';

const router = Router();

//-- ROTAS CLIENT --
router.post('/clients', adminAuthMiddleware, new CreateClientController().handle)

//-- ROTAS ADMIN --
router.post('/admins/create', superAdminAuthMiddleware, new CreateAdminController().handle)
router.post('/admins/login', new LoginAdminController().handle)
router.get('/admins/admin', adminAuthMiddleware, new GetAdminController().handle)
router.get('/admins/all', superAdminAuthMiddleware, new GetAllAdminController().handle)
router.delete('/admins/delete/:id', superAdminAuthMiddleware, new DeleteAdminController().handle)


export { router }; 