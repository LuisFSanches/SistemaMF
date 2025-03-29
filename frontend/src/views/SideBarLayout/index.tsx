import { PageContainer } from "../../styles/global";
import { Outlet } from 'react-router-dom';
import { SideBar } from "../../components/SideBar";
import { OrderNotification } from '../../components/OrderNotification';

export function SideBarLayout (){
    return(
        <PageContainer>
            <SideBar/>
            <Outlet/>
            <OrderNotification/>
        </PageContainer>
    )
}