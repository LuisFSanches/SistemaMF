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

interface IPrivateRouteProps {
    children: JSX.Element;
}

function PrivateRoute({ children }: IPrivateRouteProps) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return null;
    }

    return isAuthenticated ? children : <Navigate to="/" />;
}

function IsAuthenticatedRoutes({ children }: IPrivateRouteProps) {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) {
        return null;
    }
    return isAuthenticated ? <Navigate to="/pedidoBalcao" /> : children;
}

export default function routes(){
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<SideBarLayout/>}>
                        <Route path ="/dashboard" element={
                            <PrivateRoute>
                                <Dashboard/>
                            </PrivateRoute>
                        }/>
                        <Route path ="/pedidoBalcao" element={
                            <PrivateRoute>
                                <OnStoreOrder/>
                            </PrivateRoute>
                        }/>
                        <Route path="ordensDeServico" element={
                            <PrivateRoute>
                                <ServiceOrdersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="pedidoOnline" element={
                            <PrivateRoute>
                                <OnlineOrder/>
                            </PrivateRoute>
                        }/>
                        <Route path="aguardandoCliente" element={
                            <PrivateRoute>
                                <WaitingClientOrders/>
                            </PrivateRoute>
                        }/>
                        <Route path="produtos" element={
                            <PrivateRoute>
                                <ProductsPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="estoque" element={
                            <PrivateRoute>
                                <StockPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="clientes" element={
                            <PrivateRoute>
                                <UsersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="pedidos" element={
                            <PrivateRoute>
                                <OrdersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="pix" element={
                            <PrivateRoute>
                                <PixPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="estatisticas" element={
                            <PrivateRoute>
                                <Statistics/>
                            </PrivateRoute>
                        }/>
                        <Route path="administradores" element={
                            <PrivateRoute>
                                <AdminsPage/>
                            </PrivateRoute>
                        }/>
                    </Route>
                    <Route path="completarPedido/:id" element={
                        <CompleteOrder/>
                    }/>
                    <Route path="/" element={
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
