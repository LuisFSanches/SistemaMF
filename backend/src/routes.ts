import { Router } from 'express';

import { DashboardController } from './controllers/dashboard/DashboardController';

import { GetAllClientController } from './controllers/client/GetAllClientController'
import { GetClientController } from './controllers/client/GetClientController'
import { GetClientByPhoneNumbeController } from './controllers/client/GetClientByPhoneNumbeController'
import { CreateClientController } from './controllers/client/CreateClientController'
import { UpdateClientController } from './controllers/client/UpdateClientController';
import { RequestVerificationController } from './controllers/client/RequestVerificationController';
import { ValidateCodeController } from './controllers/client/ValidateCodeController';

import { CreateCategoryController } from './controllers/category/CreateCategoryController';
import { GetAllCategoriesController } from './controllers/category/GetAllCategoriesController';
import { GetCategoryController } from './controllers/category/GetCategoryController';
import { GetCategoryBySlugController } from './controllers/category/GetCategoryBySlugController';
import { UpdateCategoryController } from './controllers/category/UpdateCategoryController';
import { DeleteCategoryController } from './controllers/category/DeleteCategoryController';
import { UploadCategoryImageController } from './controllers/category/UploadCategoryImageController';
import { DeleteCategoryImageController } from './controllers/category/DeleteCategoryImageController';

import { AddProductCategoryController } from './controllers/productCategory/AddProductCategoryController';
import { GetProductCategoriesController } from './controllers/productCategory/GetProductCategoriesController';
import { RemoveProductCategoryController } from './controllers/productCategory/RemoveProductCategoryController';
import { UpdateProductCategoriesController } from './controllers/productCategory/UpdateProductCategoriesController';
import { RemoveAllProductCategoriesController } from './controllers/productCategory/RemoveAllProductCategoriesController';

import { CreateProductController } from './controllers/product/CreateProductController';
import { GetAllProductController } from './controllers/product/GetAllProductController';
import { GetAvailableProductsForStoreController } from './controllers/product/GetAvailableProductsForStoreController';
import { GetProductByIdController } from './controllers/product/GetProductByIdController';
import { UpdateProductController } from './controllers/product/UpdateProductController';
import { SearchProductsController } from './controllers/product/SearchProductsController';
import { UploadProductImageController } from './controllers/product/UploadProductImageController';
import { UploadProductImage2Controller } from './controllers/product/UploadProductImage2Controller';
import { UploadProductImage3Controller } from './controllers/product/UploadProductImage3Controller';
import { DeleteProductImageController } from './controllers/product/DeleteProductImageController';
import { GenerateProductQRCodeController } from './controllers/product/GenerateProductQRCodeController';
import { GetStoreFrontProductsController } from './controllers/product/GetStoreFrontProductsController';
import { ExportProductsToExcelController } from './controllers/product/ExportProductsToExcelController';
import { ImportProductsFromExcelController } from './controllers/product/ImportProductsFromExcelController';
import { ExportStoreProductsToExcelController } from './controllers/product/ExportStoreProductsToExcelController';
import { UpdateStoreProductsFromExcelController } from './controllers/product/UpdateStoreProductsFromExcelController';

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
import { UpdateAdminPasswordController } from './controllers/admin/UpdateAdminPasswordController';
import { UpdateAdminEmailController } from './controllers/admin/UpdateAdminEmailController';
import { RequestPasswordResetController } from './controllers/admin/RequestPasswordResetController';
import { ResetPasswordController } from './controllers/admin/ResetPasswordController';
import { ResetPasswordByEmailController } from './controllers/admin/ResetPasswordByEmailController';
import { SwitchStoreController } from './controllers/admin/SwitchStoreController';
import { GetAllStoresForSysAdminController } from './controllers/admin/GetAllStoresForSysAdminController';

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
import { UpdateMultipleOrderDeliveriesController } from './controllers/orderDelivery/UpdateMultipleOrderDeliveriesController';
import { DeleteOrderDeliveryController } from './controllers/orderDelivery/DeleteOrderDeliveryController';

import { CreateOrderToReceiveController } from './controllers/orderToReceive/CreateOrderToReceiveController';
import { GetOrderToReceiveController } from './controllers/orderToReceive/GetOrderToReceiveController';
import { GetAllOrderToReceiveController } from './controllers/orderToReceive/GetAllOrderToReceiveController';
import { UpdateOrderToReceiveController } from './controllers/orderToReceive/UpdateOrderToReceiveController';
import { DeleteOrderToReceiveController } from './controllers/orderToReceive/DeleteOrderToReceiveController';
import { CheckOrderToReceiveExistsController } from './controllers/orderToReceive/CheckOrderToReceiveExistsController';

import { GetSalesReportController } from './controllers/reports/GetSalesReportController';
import { GetTopProductsReportController } from './controllers/reports/GetTopProductsReportController';
import { GetTopClientsReportController } from './controllers/reports/GetTopClientsReportController';
import { GetStockReportController } from './controllers/reports/GetStockReportController';
import { GetFinancialReportController } from './controllers/reports/GetFinancialReportController';
import { GetDeliveryReportController } from './controllers/reports/GetDeliveryReportController';
import { GetSupplierReportController } from './controllers/reports/GetSupplierReportController';

import { CreateStoreController } from './controllers/store/CreateStoreController';
import { GetAllStoresController } from './controllers/store/GetAllStoresController';
import { GetStoreController } from './controllers/store/GetStoreController';
import { UpdateStoreController } from './controllers/store/UpdateStoreController';
import { UpdateStoreCredentialsController } from './controllers/store/UpdateStoreCredentialsController';
import { UpdateStoreSchedulesController } from './controllers/store/UpdateStoreSchedulesController';
import { DeleteStoreController } from './controllers/store/DeleteStoreController';
import { UploadStoreLogoController } from './controllers/store/UploadStoreLogoController';
import { UploadStoreBannerController } from './controllers/store/UploadStoreBannerController';
import { UploadStoreBanner2Controller } from './controllers/store/UploadStoreBanner2Controller';
import { UploadStoreBanner3Controller } from './controllers/store/UploadStoreBanner3Controller';

import { CreateStoreProductController } from './controllers/storeProduct/CreateStoreProductController';
import { GetAllStoreProductsController } from './controllers/storeProduct/GetAllStoreProductsController';
import { GetStoreProductController } from './controllers/storeProduct/GetStoreProductController';
import { GetStoreProductByIdController } from './controllers/storeProduct/GetStoreProductByIdController';
import { UpdateStoreProductController } from './controllers/storeProduct/UpdateStoreProductController';
import { DeleteStoreProductController } from './controllers/storeProduct/DeleteStoreProductController';
import { SearchStoreProductsController } from './controllers/storeProduct/SearchStoreProductsController';

import { CreateStoreAddressController } from './controllers/storeAddress/CreateStoreAddressController';
import { GetAllStoreAddressesController } from './controllers/storeAddress/GetAllStoreAddressesController';
import { GetStoreAddressController } from './controllers/storeAddress/GetStoreAddressController';
import { UpdateStoreAddressController } from './controllers/storeAddress/UpdateStoreAddressController';
import { DeleteStoreAddressController } from './controllers/storeAddress/DeleteStoreAddressController';

import { CreateStoreScheduleController } from './controllers/storeSchedule/CreateStoreScheduleController';
import { GetAllStoreSchedulesController } from './controllers/storeSchedule/GetAllStoreSchedulesController';
import { GetStoreScheduleController } from './controllers/storeSchedule/GetStoreScheduleController';
import { UpdateStoreScheduleController } from './controllers/storeSchedule/UpdateStoreScheduleController';
import { DeleteStoreScheduleController } from './controllers/storeSchedule/DeleteStoreScheduleController';

import { CreateStoreHolidayController } from './controllers/storeHoliday/CreateStoreHolidayController';
import { GetAllStoreHolidaysController } from './controllers/storeHoliday/GetAllStoreHolidaysController';
import { GetStoreHolidayController } from './controllers/storeHoliday/GetStoreHolidayController';
import { UpdateStoreHolidayController } from './controllers/storeHoliday/UpdateStoreHolidayController';
import { DeleteStoreHolidayController } from './controllers/storeHoliday/DeleteStoreHolidayController';

import { CreateMercadoPagoPreferenceController } from './controllers/mercadoPago/CreateMercadoPagoPreferenceController';
import { MercadoPagoWebhookController } from './controllers/mercadoPago/MercadoPagoWebhookController';
// import { TestMercadoPagoWebhookController } from './controllers/mercadoPago/TestMercadoPagoWebhookController';
import { GetMercadoPagoPaymentStatusController } from './controllers/mercadoPago/GetMercadoPagoPaymentStatusController';

import adminAuthMiddleware from './middlewares/admin_auth';
import superAdminAuthMiddleware from './middlewares/super_admin_auth';
import sysAdminAuthMiddleware from './middlewares/sys_admin_auth';
import { upload, uploadStore, uploadCategory, uploadExcel } from './config/multer';
import { processImage } from './middlewares/process_image';
import { processBannerImage } from './middlewares/process_banner_image';
import { handleMulterError } from './middlewares/multer_error';


const router = Router();

//-- ROTAS DASHBOARD --
router.get('/dashboard', adminAuthMiddleware, new DashboardController().handle);

//-- ROTAS CLIENT --
router.post('/client', adminAuthMiddleware, new CreateClientController().handle)
router.post('/client/new/online', new CreateClientController().handle)
router.post('/client/verification/request', new RequestVerificationController().handle)
router.post('/client/verification/validate', new ValidateCodeController().handle)
router.get('/clients/all', adminAuthMiddleware, new GetAllClientController().handle)
router.get('/client/phone_number', adminAuthMiddleware, new GetClientByPhoneNumbeController().handle)
router.get('/client/:id', superAdminAuthMiddleware, new GetClientController().handle)
router.put('/client/:id', adminAuthMiddleware, new UpdateClientController().handle)

//-- ROTAS CATEGORY --
router.post('/category', adminAuthMiddleware, new CreateCategoryController().handle);
router.get('/category/all', new GetAllCategoriesController().handle);
router.get('/category/slug/:slug', new GetCategoryBySlugController().handle);
router.get('/category/:id', adminAuthMiddleware, new GetCategoryController().handle);
router.put('/category/:id', adminAuthMiddleware, new UpdateCategoryController().handle);
router.delete('/category/:id', adminAuthMiddleware, new DeleteCategoryController().handle);
router.post('/category/:id/upload', adminAuthMiddleware, uploadCategory.single('file'), handleMulterError, new UploadCategoryImageController().handle);
router.delete('/category/:id/image', adminAuthMiddleware, new DeleteCategoryImageController().handle);

//-- ROTAS PRODUCT CATEGORY --
router.post('/product-category', adminAuthMiddleware, new AddProductCategoryController().handle);
router.get('/product-category/product/:product_id', new GetProductCategoriesController().handle);
router.put('/product-category/product/:product_id', adminAuthMiddleware, new UpdateProductCategoriesController().handle);
router.delete('/product-category/:id', adminAuthMiddleware, new RemoveProductCategoryController().handle);
router.delete('/product-category/product/:product_id/all', adminAuthMiddleware, new RemoveAllProductCategoriesController().handle);

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
router.post('/order', new CreateOrderController().handle);
router.post('/order/ai', adminAuthMiddleware, new CreateOrderByAIController().handle);
router.put('/order/:id', adminAuthMiddleware, new UpdateOrderController().handle);
router.put('/order/finish/:id', new FinishOnlineOrderController().handle);
router.patch('/order/:id', new UpdateOrderStatusController().handle);
router.patch('/order/:id/payment', adminAuthMiddleware, new UpdateOrderPaymentController().handle);
router.delete('/order/:id', adminAuthMiddleware, new DeleteOrderController().handle);

//-- ROTAS PRODUCT --
router.post('/product', adminAuthMiddleware, new CreateProductController().handle)
router.get('/product/all', adminAuthMiddleware, new GetAllProductController().handle)
router.get('/product/available-for-store', adminAuthMiddleware, new GetAvailableProductsForStoreController().handle)
router.get('/product/search', adminAuthMiddleware, new SearchProductsController().handle)
router.get('/product/:id', adminAuthMiddleware, new GetProductByIdController().handle)
router.put('/product/:id', adminAuthMiddleware, new UpdateProductController().handle)
router.post('/product/:id/image', adminAuthMiddleware, upload.single('image'), handleMulterError, processImage, new UploadProductImageController().handle)
router.post('/product/:id/image-2', adminAuthMiddleware, upload.single('image'), handleMulterError, processImage, new UploadProductImage2Controller().handle)
router.post('/product/:id/image-3', adminAuthMiddleware, upload.single('image'), handleMulterError, processImage, new UploadProductImage3Controller().handle)
router.delete('/product/:id/image', adminAuthMiddleware, new DeleteProductImageController().handle)
router.post('/product/:id/qrcode', adminAuthMiddleware, new GenerateProductQRCodeController().handle)
router.get('/product/export/excel', adminAuthMiddleware, new ExportProductsToExcelController().handle)
router.post('/product/import/excel', adminAuthMiddleware, uploadExcel.single('file'), handleMulterError, new ImportProductsFromExcelController().handle)

//-- ROTAS STORE PRODUCTS EXCEL --
router.get('/store-product/export/excel', adminAuthMiddleware, new ExportStoreProductsToExcelController().handle)
router.put('/store-product/update/excel', adminAuthMiddleware, uploadExcel.single('file'), handleMulterError, new UpdateStoreProductsFromExcelController().handle)

//-- ROTAS STORE PRODUCTS --
router.post('/store-product', adminAuthMiddleware, new CreateStoreProductController().handle)
router.get('/store-product/all', adminAuthMiddleware, new GetAllStoreProductsController().handle)
router.get('/store-product/search', adminAuthMiddleware, new SearchStoreProductsController().handle)
router.get('/store-product/:id', adminAuthMiddleware, new GetStoreProductController().handle)
router.put('/store-product/:id', adminAuthMiddleware, new UpdateStoreProductController().handle)
router.delete('/store-product/:id', adminAuthMiddleware, new DeleteStoreProductController().handle)

//-- ROTAS STOREFRONT (PÚBLICAS) --
router.get('/storefront/:slug/products', new GetStoreFrontProductsController().handle)
router.get('/storefront/product/:id', new GetStoreProductByIdController().handle)

//-- ROTAS ADMIN --
router.post('/admin', superAdminAuthMiddleware, new CreateAdminController().handle)
router.post('/admins/login', new LoginAdminController().handle)
router.get('/admins/admin', adminAuthMiddleware, new GetAdminController().handle)
router.get('/admins/all', superAdminAuthMiddleware, new GetAllAdminController().handle)
router.delete('/admins/delete/:id', superAdminAuthMiddleware, new DeleteAdminController().handle)
router.put('/admin/:id', superAdminAuthMiddleware, new UpdateAdminController().handle)
router.put('/admin/password/update', superAdminAuthMiddleware, new UpdateAdminPasswordController().handle)
router.put('/admin/email/update', adminAuthMiddleware, new UpdateAdminEmailController().handle)

//-- ROTAS DE RESET DE SENHA (PÚBLICAS) --
router.post('/admin/password/request-reset', new RequestPasswordResetController().handle)
router.post('/admin/password/reset', new ResetPasswordController().handle)

//-- ROTAS DE RESET DE SENHA (SUPER_ADMIN) --
router.put('/admin/password/reset-by-email', superAdminAuthMiddleware, new ResetPasswordByEmailController().handle)

//-- ROTAS SYS_ADMIN (Sistema Multi-loja) --
router.post('/admin/switch-store', sysAdminAuthMiddleware, new SwitchStoreController().handle)
router.get('/admin/stores/all', sysAdminAuthMiddleware, new GetAllStoresForSysAdminController().handle)

//-- ROTAS PIX --
router.get('/pix', adminAuthMiddleware, new GetPixController().handle)
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
router.patch('/orderDelivery/bulk-update', adminAuthMiddleware, new UpdateMultipleOrderDeliveriesController().handle);
router.delete('/orderDelivery/:id', adminAuthMiddleware, new DeleteOrderDeliveryController().handle);

//-- ROTAS ORDER TO RECEIVE --
router.post('/orderToReceive', adminAuthMiddleware, new CreateOrderToReceiveController().handle);
router.get('/orderToReceive/all', adminAuthMiddleware, new GetAllOrderToReceiveController().handle);
router.get('/orderToReceive/check/:orderId', adminAuthMiddleware, new CheckOrderToReceiveExistsController().handle);
router.get('/orderToReceive/:id', adminAuthMiddleware, new GetOrderToReceiveController().handle);
router.put('/orderToReceive/:id', adminAuthMiddleware, new UpdateOrderToReceiveController().handle);
router.delete('/orderToReceive/:id', adminAuthMiddleware, new DeleteOrderToReceiveController().handle);

//-- ROTAS REPORTS --
router.get('/reports/sales', adminAuthMiddleware, new GetSalesReportController().handle);
router.get('/reports/products/top', adminAuthMiddleware, new GetTopProductsReportController().handle);
router.get('/reports/clients/top', adminAuthMiddleware, new GetTopClientsReportController().handle);
router.get('/reports/stock', adminAuthMiddleware, new GetStockReportController().handle);
router.get('/reports/financial', adminAuthMiddleware, new GetFinancialReportController().handle);
router.get('/reports/delivery', adminAuthMiddleware, new GetDeliveryReportController().handle);
router.get('/reports/supplier', adminAuthMiddleware, new GetSupplierReportController().handle);

//-- ROTAS STORE --
router.post('/store', new CreateStoreController().handle);
router.get('/store/all', superAdminAuthMiddleware, new GetAllStoresController().handle);
router.get('/store/slug/:slug', new GetStoreController().handle); // Público para storefront
router.get('/store/:id', superAdminAuthMiddleware, new GetStoreController().handle);
router.put('/store/:id', superAdminAuthMiddleware, new UpdateStoreController().handle);
router.put('/store/:id/credentials', superAdminAuthMiddleware, new UpdateStoreCredentialsController().handle);
router.put('/store/:id/schedules', adminAuthMiddleware, new UpdateStoreSchedulesController().handle);
router.delete('/store/:id', superAdminAuthMiddleware, new DeleteStoreController().handle);
router.post('/store/:id/logo', superAdminAuthMiddleware, uploadStore.single('logo'), handleMulterError, processImage, new UploadStoreLogoController().handle);
router.post('/store/:id/banner', superAdminAuthMiddleware, uploadStore.single('banner'), handleMulterError, processBannerImage, new UploadStoreBannerController().handle);
router.post('/store/:id/banner-2', superAdminAuthMiddleware, uploadStore.single('banner'), handleMulterError, processBannerImage, new UploadStoreBanner2Controller().handle);
router.post('/store/:id/banner-3', superAdminAuthMiddleware, uploadStore.single('banner'), handleMulterError, processBannerImage, new UploadStoreBanner3Controller().handle);

//-- ROTAS STORE ADDRESS --
router.post('/storeAddress', adminAuthMiddleware, new CreateStoreAddressController().handle);
router.get('/storeAddress/store/:store_id', new GetAllStoreAddressesController().handle); // Público para storefront
router.get('/storeAddress/:id', adminAuthMiddleware, new GetStoreAddressController().handle);
router.put('/storeAddress/:id', adminAuthMiddleware, new UpdateStoreAddressController().handle);
router.delete('/storeAddress/:id', adminAuthMiddleware, new DeleteStoreAddressController().handle);

//-- ROTAS STORE SCHEDULE --
router.post('/storeSchedule', adminAuthMiddleware, new CreateStoreScheduleController().handle);
router.get('/storeSchedule/store/:store_id', new GetAllStoreSchedulesController().handle); // Público para storefront
router.get('/storeSchedule/:id', adminAuthMiddleware, new GetStoreScheduleController().handle);
router.put('/storeSchedule/:id', adminAuthMiddleware, new UpdateStoreScheduleController().handle);
router.delete('/storeSchedule/:id', adminAuthMiddleware, new DeleteStoreScheduleController().handle);

//-- ROTAS STORE HOLIDAY --
router.post('/storeHoliday', adminAuthMiddleware, new CreateStoreHolidayController().handle);
router.get('/storeHoliday/store/:store_id', new GetAllStoreHolidaysController().handle); // Público para storefront
router.get('/storeHoliday/:id', adminAuthMiddleware, new GetStoreHolidayController().handle);
router.put('/storeHoliday/:id', adminAuthMiddleware, new UpdateStoreHolidayController().handle);
router.delete('/storeHoliday/:id', adminAuthMiddleware, new DeleteStoreHolidayController().handle);

//-- ROTAS MERCADO PAGO (STOREFRONT) --
router.post('/mercadopago/preference', new CreateMercadoPagoPreferenceController().handle);
router.post('/webhook/mercadopago', new MercadoPagoWebhookController().handle);
// router.post('/webhook/mercadopago/test', new TestMercadoPagoWebhookController().handle);
router.get('/mercadopago/payment/:payment_id', new GetMercadoPagoPaymentStatusController().handle); // Rota legacy
router.get('/mercadopago/payment/status', new GetMercadoPagoPaymentStatusController().handle); // Rota com query params

export { router };