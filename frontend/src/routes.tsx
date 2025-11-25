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
import { OrdersToReceivePage } from "./views/OrdersToReceive";
import { StoreFront } from "./views/StoreFront";
import { Cart } from "./views/Cart";
import { Checkout } from "./views/Checkout";
import { ClientDetail } from "./views/ClientDetail";

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
                        <Route path="/backoffice/pedidos" element={
                            <PrivateRoute>
                                <OrdersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="/backoffice/valores-a-receber" element={
                            <PrivateRoute>
                                <OrdersToReceivePage/>
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
                        <Route path="/backoffice/administradores" element={
                            <PrivateRoute>
                                <AdminsPage/>
                            </PrivateRoute>
                        }/>
                    </Route>
                    <Route path="/" element={<StoreFront />} />
                    <Route path="/carrinho" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="completarPedido/:id" element={
                        <CompleteOrder/>
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
