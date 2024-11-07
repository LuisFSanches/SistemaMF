import { PageContainer } from "../../styles/global";
import { Outlet } from 'react-router-dom';
import { SideBar } from "../../components/SideBar";

export function SideBarLayout (){
    return(
        <PageContainer>
            <SideBar/>
            <Outlet/>
        </PageContainer>
    )
        
}