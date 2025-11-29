import { Router } from 'express';

import { DashboardController } from './controllers/dashboard/DashboardController';

import { GetAllClientController } from './controllers/client/GetAllClientController'
import { GetClientController } from './controllers/client/GetClientController'
import { GetClientByPhoneNumbeController } from './controllers/client/GetClientByPhoneNumbeController'
import { CreateClientController } from './controllers/client/CreateClientController'
import { UpdateClientController } from './controllers/client/UpdateClientController';

import { CreateProductController } from './controllers/product/CreateProductController';
import { GetAllProductController } from './controllers/product/GetAllProductController';
import { GetProductByIdController } from './controllers/product/GetProductByIdController';
import { UpdateProductController } from './controllers/product/UpdateProductController';
import { SearchProductsController } from './controllers/product/SearchProductsController';
import { UploadProductImageController } from './controllers/product/UploadProductImageController';
import { DeleteProductImageController } from './controllers/product/DeleteProductImageController';
import { GenerateProductQRCodeController } from './controllers/product/GenerateProductQRCodeController';
import { GetStoreFrontProductsController } from './controllers/product/GetStoreFrontProductsController';

import { CreateAddressController } from './controllers/address/CreateAddressController';
import { GetAllClientAddressController } from './controllers/address/GetAllClientAddressController';
import { GetPickUpAddressController } from './controllers/address/GetPickUpAddressController';

import { CreateOrderController } from './controllers/order/CreateOrderController';
import { CreateOrderByAIController } from './controllers/order/CreateOrderByAIController';
import { GetOnGoingOrderController } from './controllers/order/GetOnGoingOrderController';
import { GetAllOrderController } from './controllers/order/GetAllOrderController';
import { UpdateOrderController } from './controllers/order/UpdateOrderController';
import { UpdateOrderStatusController } from './controllers/order/UpdateOrderStatusController';
import { UpdateOrderPaymentController } from './controllers/order/UpdateOrderPaymentController';
import { GetCompleteOrderController } from './controllers/order/GetCompleteOrderController';
import { GetOrderDetailsController } from './controllers/order/GetOrderDetailsController';
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

import { CreateStockTransactionController } from './controllers/stockTransaction/CreateStockTransactionController';
import { GetAllStockTransactionsController } from './controllers/stockTransaction/GetAllStockTransactionsController';
import { GetProductStockDetailsController } from './controllers/stockTransaction/GetProductStockDetailsController';
import { DeleteStockTransactionController } from './controllers/stockTransaction/DeleteStockTransactionController';

import { CreateSupplierController } from './controllers/supplier/CreateSupplierController';
import { GetAllSuppliersController } from './controllers/supplier/GetAllSuppliersController';

import { CreateDeliveryManController } from './controllers/deliveryMan/CreateDeliveryManController';
import { GetAllDeliveryMenController } from './controllers/deliveryMan/GetAllDeliveryMenController';
import { GetDeliveryManController } from './controllers/deliveryMan/GetDeliveryManController';
import { GetDeliveryManByPhoneController } from './controllers/deliveryMan/GetDeliveryManByPhoneController';
import { UpdateDeliveryManController } from './controllers/deliveryMan/UpdateDeliveryManController';
import { DeleteDeliveryManController } from './controllers/deliveryMan/DeleteDeliveryManController';

import { CreateOrderDeliveryController } from './controllers/orderDelivery/CreateOrderDeliveryController';
import { GetAllOrderDeliveriesController } from './controllers/orderDelivery/GetAllOrderDeliveriesController';
import { GetOrderDeliveryController } from './controllers/orderDelivery/GetOrderDeliveryController';
import { UpdateOrderDeliveryController } from './controllers/orderDelivery/UpdateOrderDeliveryController';
import { DeleteOrderDeliveryController } from './controllers/orderDelivery/DeleteOrderDeliveryController';

import { CreateOrderToReceiveController } from './controllers/orderToReceive/CreateOrderToReceiveController';
import { GetOrderToReceiveController } from './controllers/orderToReceive/GetOrderToReceiveController';
import { GetAllOrderToReceiveController } from './controllers/orderToReceive/GetAllOrderToReceiveController';
import { UpdateOrderToReceiveController } from './controllers/orderToReceive/UpdateOrderToReceiveController';
import { DeleteOrderToReceiveController } from './controllers/orderToReceive/DeleteOrderToReceiveController';
import { CheckOrderToReceiveExistsController } from './controllers/orderToReceive/CheckOrderToReceiveExistsController';

import adminAuthMiddleware from './middlewares/admin_auth';
import superAdminAuthMiddleware from './middlewares/super_admin_auth';
import { upload } from './config/multer';
import { processImage } from './middlewares/process_image';
import { handleMulterError } from './middlewares/multer_error';


const router = Router();

//-- ROTAS DASHBOARD --
router.get('/dashboard', adminAuthMiddleware, new DashboardController().handle);

//-- ROTAS CLIENT --
router.post('/client', adminAuthMiddleware, new CreateClientController().handle)
router.post('/client/new/online', new CreateClientController().handle)
router.get('/clients/all', adminAuthMiddleware, new GetAllClientController().handle)
router.get('/client/phone_number', new GetClientByPhoneNumbeController().handle)
router.get('/client/:id', superAdminAuthMiddleware, new GetClientController().handle)
router.put('/client/:id', adminAuthMiddleware, new UpdateClientController().handle)

//-- ROTAS ADDRESS --
router.post('/address', adminAuthMiddleware, new CreateAddressController().handle)
router.get('/address/pickup', adminAuthMiddleware, new GetPickUpAddressController().handle)
router.get('/address/:client_id', new GetAllClientAddressController().handle)

//-- ROTAS ORDER --
router.get('/order/detail/:id', adminAuthMiddleware, new GetOrderDetailsController().handle);
router.get('/order/completedOrder/:id', new GetCompleteOrderController().handle);
router.get('/order/ongoing', adminAuthMiddleware, new GetOnGoingOrderController().handle);
router.get('/order/all', adminAuthMiddleware, new GetAllOrderController().handle);
router.get('/order/waitingForClient', adminAuthMiddleware, new GetWaitingOnlineOrderController().handle);
router.post('/order', adminAuthMiddleware, new CreateOrderController().handle);
router.post('/order/ai', adminAuthMiddleware, new CreateOrderByAIController().handle);
router.put('/order/:id', adminAuthMiddleware, new UpdateOrderController().handle);
router.put('/order/finish/:id', new FinishOnlineOrderController().handle);
router.patch('/order/:id', adminAuthMiddleware, new UpdateOrderStatusController().handle);
router.patch('/order/:id/payment', adminAuthMiddleware, new UpdateOrderPaymentController().handle);
router.delete('/order/:id', adminAuthMiddleware, new DeleteOrderController().handle);

//-- ROTAS PRODUCT --
router.post('/product', adminAuthMiddleware, new CreateProductController().handle)
router.get('/product/all', superAdminAuthMiddleware, new GetAllProductController().handle)
router.get('/product/search', superAdminAuthMiddleware, new SearchProductsController().handle)
router.get('/product/:id', adminAuthMiddleware, new GetProductByIdController().handle)
router.put('/product/:id', superAdminAuthMiddleware, new UpdateProductController().handle)
router.post('/product/:id/image', adminAuthMiddleware, upload.single('image'), handleMulterError, processImage, new UploadProductImageController().handle)
router.delete('/product/:id/image', adminAuthMiddleware, new DeleteProductImageController().handle)
router.post('/product/:id/qrcode', adminAuthMiddleware, new GenerateProductQRCodeController().handle)

//-- ROTAS STOREFRONT (PÚBLICAS) --
router.get('/storefront/products', new GetStoreFrontProductsController().handle)

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

//-- ROTAS STOCK TRANSACTION --
router.get('/stockTransaction/all', adminAuthMiddleware, new GetAllStockTransactionsController().handle);
router.get('/stockTransaction/product/:id', adminAuthMiddleware, new GetProductStockDetailsController().handle);
router.post('/stockTransaction', adminAuthMiddleware, new CreateStockTransactionController().handle);
router.delete('/stockTransaction/:id', adminAuthMiddleware, new DeleteStockTransactionController().handle);

//-- ROTAS SUPPLIER --
router.post('/supplier', adminAuthMiddleware, new CreateSupplierController().handle);
router.get('/supplier/all', adminAuthMiddleware, new GetAllSuppliersController().handle);

//-- ROTAS DELIVERY MEN --
router.post('/deliveryMan', adminAuthMiddleware, new CreateDeliveryManController().handle);
router.get('/deliveryMan/all', adminAuthMiddleware, new GetAllDeliveryMenController().handle);
router.get('/deliveryMan/phone_code', new GetDeliveryManByPhoneController().handle);
router.get('/deliveryMan/:id', adminAuthMiddleware, new GetDeliveryManController().handle);
router.put('/deliveryMan/:id', adminAuthMiddleware, new UpdateDeliveryManController().handle);
router.delete('/deliveryMan/:id', adminAuthMiddleware, new DeleteDeliveryManController().handle);

//-- ROTAS ORDER DELIVERIES --
router.post('/orderDelivery', new CreateOrderDeliveryController().handle);
router.get('/orderDelivery/all', adminAuthMiddleware, new GetAllOrderDeliveriesController().handle);
router.get('/orderDelivery/:id', adminAuthMiddleware, new GetOrderDeliveryController().handle);
router.put('/orderDelivery/:id', adminAuthMiddleware, new UpdateOrderDeliveryController().handle);
router.delete('/orderDelivery/:id', adminAuthMiddleware, new DeleteOrderDeliveryController().handle);

//-- ROTAS ORDER TO RECEIVE --
router.post('/orderToReceive', adminAuthMiddleware, new CreateOrderToReceiveController().handle);
router.get('/orderToReceive/all', adminAuthMiddleware, new GetAllOrderToReceiveController().handle);
router.get('/orderToReceive/check/:orderId', adminAuthMiddleware, new CheckOrderToReceiveExistsController().handle);
router.get('/orderToReceive/:id', adminAuthMiddleware, new GetOrderToReceiveController().handle);
router.put('/orderToReceive/:id', adminAuthMiddleware, new UpdateOrderToReceiveController().handle);
router.delete('/orderToReceive/:id', adminAuthMiddleware, new DeleteOrderToReceiveController().handle);

export { router };