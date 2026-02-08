import { useContext } from "react";
import { PageContainer, BodyContainer } from "../../styles/global";
import { Outlet } from 'react-router-dom';
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { OrderNotification } from '../../components/OrderNotification';
import { StoreOnboarding } from '../../components/StoreOnboarding';
import { StoreFrontFooter } from '../../components/StoreFrontFooter';
import { AuthContext } from "../../contexts/AuthContext";

export function SideBarLayout (){
    const { needsOnboarding, storeData, refreshStoreData } = useContext(AuthContext);

    const handleOnboardingComplete = async () => {
        await refreshStoreData();
        window.location.reload();
    };

    return(
        <PageContainer>
            {needsOnboarding && storeData && (
                <StoreOnboarding
                    storeId={storeData.id}
                    storeName={storeData.name}
                    onComplete={handleOnboardingComplete}
                />
            )}
            <Header/>
            <BodyContainer>
                <SideBar/>
                <Outlet/>
                <OrderNotification/>
            </BodyContainer>
            <StoreFrontFooter/>
        </PageContainer>
    )
}