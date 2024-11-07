import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

import { ProductsPage } from "./views/Products";
import { DashboardPage } from "./views/Dashboard";
import { GlobalStyle } from "./styles/global";
import { ServiceOrdersPage } from "./views/Service-Orders";
import { UsersPage } from "./views/Users";
import { CategoriesPage } from "./views/Categories";
import { LoginPage } from "./views/LoginPage";
import { SideBarLayout } from "./views/SideBarLayout";
import { Statistics } from "./views/Statistics";

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
                        <Route path="ordens-de-servico" element={<ServiceOrdersPage/>}/>
                        <Route path="produtos" element={<ProductsPage/>}/>
                        <Route path="categorias" element={<CategoriesPage/>}/>  
                        <Route path="usuarios" element={<UsersPage/>}/>
                        <Route path="estatisticas" element={<Statistics/>}/>
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
