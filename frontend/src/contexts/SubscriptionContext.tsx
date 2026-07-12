import { createContext, ReactNode, useState, useContext, useCallback } from "react";
import { 
    ISubscriptionPlan, 
    ISubscriptionStatus, 
    IBillingInfo,
    ICreateSubscriptionData
} from "../interfaces/ISubscription";
import { 
    getPublicPlans, 
    getSubscriptionStatus, 
    createSubscription as createSubscriptionService,
    cancelSubscription as cancelSubscriptionService,
    getBillingInfo
} from "../services/subscriptionService";

interface ISubscriptionContextData {
    subscriptionStatus: ISubscriptionStatus | null;
    plans: ISubscriptionPlan[];
    billingInfo: IBillingInfo | null;
    loading: boolean;
    showSubscriptionModal: boolean;
    showPlanSelectorModal: boolean;
    showBillingModal: boolean;
    checkSubscriptionStatus: () => Promise<void>;
    loadPlans: () => Promise<void>;
    loadBillingInfo: () => Promise<void>;
    createSubscription: (data: ICreateSubscriptionData) => Promise<void>;
    cancelSubscription: (storeId: string) => Promise<void>;
    setShowSubscriptionModal: (show: boolean) => void;
    setShowPlanSelectorModal: (show: boolean) => void;
    setShowBillingModal: (show: boolean) => void;
}

interface ISubscriptionProviderProps {
    children: ReactNode;
}

export const SubscriptionContext = createContext({} as ISubscriptionContextData);

export function SubscriptionProvider({ children }: ISubscriptionProviderProps) {
    const [subscriptionStatus, setSubscriptionStatus] = useState<ISubscriptionStatus | null>(null);
    const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
    const [billingInfo, setBillingInfo] = useState<IBillingInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showPlanSelectorModal, setShowPlanSelectorModal] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);

    const checkSubscriptionStatus = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getSubscriptionStatus();
            // setSubscriptionStatus(data);
            
            // Lógica para mostrar modais baseado no status
            if (!data.is_active) {
                setShowSubscriptionModal(true);
            } else if (data.is_trial && data.days_remaining !== undefined && data.days_remaining <= 3) {
                setShowPlanSelectorModal(true);
            }
        } catch (error) {
            console.error("Erro ao verificar status da assinatura:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadPlans = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getPublicPlans();
            setPlans(data);
        } catch (error) {
            console.error("Erro ao carregar planos:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadBillingInfo = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getBillingInfo();
            setBillingInfo(data);
        } catch (error) {
            console.error("Erro ao carregar informações de faturamento:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const createSubscription = useCallback(async (data: ICreateSubscriptionData) => {
        setLoading(true);
        try {
            await createSubscriptionService(data);
            await checkSubscriptionStatus();
            setShowPlanSelectorModal(false);
            setShowSubscriptionModal(false);
        } catch (error) {
            console.error("Erro ao criar assinatura:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [checkSubscriptionStatus]);

    const cancelSubscription = useCallback(async (storeId: string) => {
        setLoading(true);
        try {
            await cancelSubscriptionService(storeId);
            await checkSubscriptionStatus();
        } catch (error) {
            console.error("Erro ao cancelar assinatura:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [checkSubscriptionStatus]);

    return (
        <SubscriptionContext.Provider
            value={{
                subscriptionStatus,
                plans,
                billingInfo,
                loading,
                showSubscriptionModal,
                showPlanSelectorModal,
                showBillingModal,
                checkSubscriptionStatus,
                loadPlans,
                loadBillingInfo,
                createSubscription,
                cancelSubscription,
                setShowSubscriptionModal,
                setShowPlanSelectorModal,
                setShowBillingModal,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error("useSubscription must be used within a SubscriptionProvider");
    }
    return context;
}
