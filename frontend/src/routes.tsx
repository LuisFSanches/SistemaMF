import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

import { ProductsPage } from "./views/Products";
import { DashboardPage } from "./views/Dashboard";
import { GlobalStyle } from "./styles/global";
import { ServiceOrdersPage } from "./views/Service-Orders";
import { UsersPage } from "./views/Users";
import { OrdersPage } from "./views/Orders";
import { CategoriesPage } from "./views/Categories";
import { LoginPage } from "./views/LoginPage";
import { SideBarLayout } from "./views/SideBarLayout";
import { Statistics } from "./views/Statistics";
import { AdminsPage } from "./views/Admins";
import { PixPage } from "./views/PixPage";
import { OnlineOrder } from "./views/OnlineOrder";

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
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
}

export default function routes(){
    return(
        <>
            <BrowserRouter>
                <Routes>
                    <Route element={<SideBarLayout/>}>
                        <Route path ="/dashboard" element={
                            <PrivateRoute>
                                <DashboardPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="ordensDeServico" element={
                            <PrivateRoute>
                                <ServiceOrdersPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="produtos" element={
                            <PrivateRoute>
                                <ProductsPage/>
                            </PrivateRoute>
                        }/>
                        <Route path="pedidoOnline" element={
                            <PrivateRoute>
                                <OnlineOrder/>
                            </PrivateRoute>
                        }/>
                        <Route path="categorias" element={
                            <PrivateRoute>
                                <CategoriesPage/>
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
