import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

import { Dashboard } from "./views/Dashboard";
import { OnStoreOrder } from "./views/OnStoreOrder";
import { GlobalStyle } from "./styles/global";
import { ServiceOrdersPage } from "./views/Service-Orders";
import { UsersPage } from "./views/Users";
import { OrdersPage } from "./views/Orders";
import { LoginPage } from "./views/LoginPage";
import { SideBarLayout } from "./views/SideBarLayout";
import { Statistics } from "./views/Statistics";
import { AdminsPage } from "./views/Admins";
import { PixPage } from "./views/PixPage";
import { OnlineOrder } from "./views/OnlineOrder";
import { CompleteOrder } from "./views/CompleteOrder";
import { WaitingClientOrders } from "./views/WaitingClientOrders";
import { ProductsPage } from "./views/Products";
import { StockPage } from "./views/Stock";
import { ProductStockDetail } from "./views/ProductStockDetail";
import { GeneralCatalog } from "./views/GeneralCatalog";
import { ParentProducts } from "./views/ParentProducts";
import { OrdersToReceivePage } from "./views/OrdersToReceive";
import { OrderDeliveriesPage } from "./views/OrderDeliveries";
import { CompleteDelivery } from "./views/CompleteDelivery";
import { StoreFront } from "./views/StoreFront";
import { Cart } from "./views/Cart";
import { Checkout } from "./views/Checkout";
import { CheckoutResult } from "./views/CheckoutResult";
import { ClientDetail } from "./views/ClientDetail";
import { DeliveryMenPage } from "./views/DeliveryMen";
import { DeliveryManDetail } from "./views/DeliveryManDetail";
import { OrderDetail } from "./views/OrderDetail";
import { ProductDetail } from "./views/ProductDetail";
// import { StoreRegistration } from "./views/StoreRegistration";
import { Reports } from "./views/Reports";
import { StoreRegistration } from "./views/StoreRegistration";
import StoreSettings from "./views/StoreSettings";
import { ForgotPasswordPage } from "./views/ForgotPasswordPage";
import { ResetPasswordPage } from "./views/ResetPasswordPage";
import { CategoriesPage } from "./views/Categories";

interface IPrivateRouteProps {
    children: JSX.Element;
}

function PrivateRoute({ children }: IPrivateRouteProps) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return null;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

function IsAuthenticatedRoutes({ children }: IPrivateRouteProps) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return null;
    }
    return isAuthenticated ? <Navigate to="/backoffice/pedidoBalcao" /> : children;
}

export default function routes(){
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<SideBarLayout/>}>
                        <Route path ="/backoffice/dashboard" element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }/>
                        <Route path ="/backoffice/pedidoBalcao" element={
                            <PrivateRoute>
                                <OnStoreOrder/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/ordensDeServico" element={
                            <PrivateRoute>
                                <ServiceOrdersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/pedidoOnline" element={
                            <PrivateRoute>
                                <OnlineOrder/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/aguardandoCliente" element={
                            <PrivateRoute>
                                <WaitingClientOrders/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/produtos" element={
                            <PrivateRoute>
                                <ProductsPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/meus-produtos" element={
                            <PrivateRoute>
                                <ProductsPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/catalogo-geral" element={
                            <PrivateRoute>
                                <GeneralCatalog/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/produtos-pais" element={
                            <PrivateRoute>
                                <ParentProducts/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/estoque" element={
                            <PrivateRoute>
                                <StockPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/estoque/produto/:id" element={
                            <PrivateRoute>
                                <ProductStockDetail/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/clientes" element={
                            <PrivateRoute>
                                <UsersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/clientes/:id" element={
                            <PrivateRoute>
                                <ClientDetail/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/categorias" element={
                            <PrivateRoute>
                                <CategoriesPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/motoboys" element={
                            <PrivateRoute>
                                <DeliveryMenPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/motoboy/:id" element={
                            <PrivateRoute>
                                <DeliveryManDetail/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/pedidos" element={
                            <PrivateRoute>
                                <OrdersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/pedido/:id" element={
                            <PrivateRoute>
                                <OrderDetail/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/valores-a-receber" element={
                            <PrivateRoute>
                                <OrdersToReceivePage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/entregas" element={
                            <PrivateRoute>
                                <OrderDeliveriesPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/pix" element={
                            <PrivateRoute>
                                <PixPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/estatisticas" element={
                            <PrivateRoute>
                                <Statistics/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/relatorios" element={
                            <PrivateRoute>
                                <Reports/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/administradores" element={
                            <PrivateRoute>
                                <AdminsPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/configuracoes" element={
                            <PrivateRoute>
                                <StoreSettings/>
                            </PrivateRoute>
                        }/>
                    </Route>
                    <Route path="/:slug" element={<StoreFront />} />
                    <Route path="/:slug/categoria/:categorySlug" element={<StoreFront />} />
                    <Route path="/:slug/produto/:productId" element={<ProductDetail />} />
                    <Route path="/:slug/carrinho" element={<Cart />} />
                    <Route path="/:slug/checkout" element={<Checkout />} />
                    <Route path="/:slug/checkout/:status" element={<CheckoutResult />} />
                    <Route path="/cadastro" element={<StoreRegistration />} />
                    <Route path="/esqueci-senha" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="completarPedido/:id" element={
                        <CompleteOrder/>
                    }/>
                    <Route path="concluirEntrega/:id" element={
                        <CompleteDelivery/>
                    }/>
                    <Route path="/login" element={
                        <IsAuthenticatedRoutes>
                            <LoginPage/>
                        </IsAuthenticatedRoutes>
                    }/>

                    <Route path="/backoffice" element={
                        <IsAuthenticatedRoutes>
                            <LoginPage/>
                        </IsAuthenticatedRoutes>
                    }/>
                </Routes>
            
            </BrowserRouter>
            
            <GlobalStyle/>
        </>
    )
}
