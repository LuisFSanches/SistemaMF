import { Router } from 'express';

import { DashboardController } from './controllers/dashboard/DashboardController';

import { GetAllClientController } from './controllers/client/GetAllClientController'
import { GetClientController } from './controllers/client/GetClientController'
import { GetClientByPhoneNumbeController } from './controllers/client/GetClientByPhoneNumbeController'
import { CreateClientController } from './controllers/client/CreateClientController'
import { UpdateClientController } from './controllers/client/UpdateClientController';

import { CreateProductController } from './controllers/product/CreateProductController';
import { GetAllProductController } from './controllers/product/GetAllProductController';
import { UpdateProductController } from './controllers/product/UpdateProductController';

import { CreateAddressController } from './controllers/address/CreateAddressController';
import { GetAllClientAddressController } from './controllers/address/GetAllClientAddressController';
import { GetPickUpAddressController } from './controllers/address/GetPickUpAddressController';

import { CreateOrderController } from './controllers/order/CreateOrderController';
import { GetOnGoingOrderController } from './controllers/order/GetOnGoingOrderController';
import { GetAllOrderController } from './controllers/order/GetAllOrderController';
import { UpdateOrderController } from './controllers/order/UpdateOrderController';
import { UpdateOrderStatusController } from './controllers/order/UpdateOrderStatusController';
import { GetOrderController } from './controllers/order/GetOrderController';
import { FinishOnlineOrderController } from './controllers/order/FinishOnlineOrderController';
import { GetWaitingOnlineOrderController } from './controllers/order/GetWaitingOnlineOrderController';
import { DeleteOrderController } from './controllers/order/DeleteOrderController';

import { CreateAdminController } from './controllers/admin/CreateAdminController'
import { LoginAdminController } from './controllers/admin/LoginAdminController'
import { GetAdminController } from './controllers/admin/GetAdminController'
import { GetAllAdminController } from './controllers/admin/GetAllAdminController'
import { DeleteAdminController } from './controllers/admin/DeleteAdminController'
import { UpdateAdminController } from './controllers/admin/UpdateAdminController';

import { GetPixController } from './controllers/inter/GetPixController';
// import { RegisterWebhookController } from './controllers/inter/RegisterWebhookController';
import { WebhookPixController } from './controllers/inter/WebhookPixController';

import { TopClientsController } from './controllers/statistics/TopClientsController';
import { DailySalesController } from './controllers/statistics/DailySalesController';
import { TopAdminsController } from './controllers/statistics/TopAdminsController';

import adminAuthMiddleware from './middlewares/admin_auth';
import superAdminAuthMiddleware from './middlewares/super_admin_auth';


const router = Router();

//-- ROTAS DASHBOARD --
router.get('/dashboard', adminAuthMiddleware, new DashboardController().handle);

//-- ROTAS CLIENT --
router.post('/client', adminAuthMiddleware, new CreateClientController().handle)
router.get('/clients/all', adminAuthMiddleware, new GetAllClientController().handle)
router.get('/client/phone_number', superAdminAuthMiddleware, new GetClientByPhoneNumbeController().handle)
router.get('/client/:id', superAdminAuthMiddleware, new GetClientController().handle)
router.put('/client/:id', adminAuthMiddleware, new UpdateClientController().handle)

//-- ROTAS ADDRESS --
router.post('/address', adminAuthMiddleware, new CreateAddressController().handle)
router.get('/address/pickup', adminAuthMiddleware, new GetPickUpAddressController().handle)
router.get('/address/:client_id', superAdminAuthMiddleware, new GetAllClientAddressController().handle)

//-- ROTAS ORDER --
router.get('/order/completedOrder/:id', new GetOrderController().handle);
router.get('/order/ongoing', adminAuthMiddleware, new GetOnGoingOrderController().handle);
router.get('/order/all', adminAuthMiddleware, new GetAllOrderController().handle);
router.get('/order/waitingForClient', adminAuthMiddleware, new GetWaitingOnlineOrderController().handle);
router.post('/order', adminAuthMiddleware, new CreateOrderController().handle);
router.put('/order/:id', adminAuthMiddleware, new UpdateOrderController().handle);
router.put('/order/finish/:id', new FinishOnlineOrderController().handle);
router.patch('/order/:id', adminAuthMiddleware, new UpdateOrderStatusController().handle);
router.delete('/order/:id', adminAuthMiddleware, new DeleteOrderController().handle);

//-- ROTAS PRODUCT --
router.post('/product', adminAuthMiddleware, new CreateProductController().handle)
router.put('/product/:id', superAdminAuthMiddleware, new UpdateProductController().handle)
router.get('/product/all', superAdminAuthMiddleware, new GetAllProductController().handle)

//-- ROTAS ADMIN --
router.post('/admin', superAdminAuthMiddleware, new CreateAdminController().handle)
router.post('/admins/login', new LoginAdminController().handle)
router.get('/admins/admin', adminAuthMiddleware, new GetAdminController().handle)
router.get('/admins/all', superAdminAuthMiddleware, new GetAllAdminController().handle)
router.delete('/admins/delete/:id', superAdminAuthMiddleware, new DeleteAdminController().handle)
router.put('/admin/:id', superAdminAuthMiddleware, new UpdateAdminController().handle)

//-- ROTAS PIX --
router.get('/pix', superAdminAuthMiddleware, new GetPixController().handle)
router.post('/webhook/pix', superAdminAuthMiddleware,  new WebhookPixController().handle)
// router.put('/create/webhook', new RegisterWebhookController().handle)

//-- ROTAS STATISTICS --
router.get('/statistics/top-clients', superAdminAuthMiddleware, new TopClientsController().handle);
router.get('/statistics/daily-sales', superAdminAuthMiddleware, new DailySalesController().handle);
router.get('/statistics/top-admins', superAdminAuthMiddleware, new TopAdminsController().handle);

export { router };