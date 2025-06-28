import { PageContainer, BodyContainer } from "../../styles/global";
import { Outlet } from 'react-router-dom';
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { OrderNotification } from '../../components/OrderNotification';

export function SideBarLayout (){
    return(
        <PageContainer>
            <Header/>
            <BodyContainer>
                <SideBar/>
                <Outlet/>
                <OrderNotification/>
            </BodyContainer>
            
        </PageContainer>
    )
}