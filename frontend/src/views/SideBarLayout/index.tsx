import { useContext, useEffect } from "react";
import { PageContainer, BodyContainer } from "../../styles/global";
import { Outlet } from 'react-router-dom';
import { SideBar } from "../../components/SideBar";
import { Header } from "../../components/Header";
import { OrderNotification } from '../../components/OrderNotification';
import { StoreOnboarding } from '../../components/StoreOnboarding';
import { StoreFrontFooter } from '../../components/StoreFrontFooter';
import { SubscriptionExpiredModal } from '../../components/SubscriptionExpiredModal';
import { PlanSelectorModal } from '../../components/PlanSelectorModal';
import { AuthContext } from "../../contexts/AuthContext";
// import { useSubscription } from "../../contexts/SubscriptionContext";

export function SideBarLayout (){
    const { needsOnboarding, storeData, refreshStoreData } = useContext(AuthContext);
    /*const { 
        showSubscriptionModal, 
        showPlanSelectorModal, 
        setShowSubscriptionModal, 
        setShowPlanSelectorModal,
        checkSubscriptionStatus 
    } = useSubscription();

    useEffect(() => {
        // Verificar status da assinatura ao montar o componente
        checkSubscriptionStatus();
    }, [checkSubscriptionStatus]);

    useEffect(() => {
        // Listener para capturar erro de trial expirado
        const handleTrialExpired = () => {
            setShowSubscriptionModal(true);
        };

        window.addEventListener('subscription-trial-expired', handleTrialExpired);

        return () => {
            window.removeEventListener('subscription-trial-expired', handleTrialExpired);
        };
    }, [setShowSubscriptionModal]);*/

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
            
            {/* Modais de Assinatura */}
            {/* <SubscriptionExpiredModal 
                isOpen={showSubscriptionModal}
                onRequestClose={() => setShowSubscriptionModal(false)}
            />
            <PlanSelectorModal
                isOpen={showPlanSelectorModal}
                onRequestClose={() => setShowPlanSelectorModal(false)}
            /> */}
        </PageContainer>
    )
}