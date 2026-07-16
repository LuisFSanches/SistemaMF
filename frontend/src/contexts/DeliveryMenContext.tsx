import { createContext, useContext, useState } from "react";
import { listAllDeliveryMen } from "../services/deliveryManService";
import { IDeliveryMan } from "../interfaces/IDeliveryMan";

interface DeliveryMenContextType {
    deliveryMen: IDeliveryMan[];
    isLoading: boolean;
    hasLoaded: boolean;
    loadDeliveryMen: () => Promise<void>;
}

const DeliveryMenContext = createContext<DeliveryMenContextType | undefined>(undefined);

export const DeliveryMenProvider: React.FC = ({ children }) => {
    const [deliveryMen, setDeliveryMen] = useState<IDeliveryMan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const loadDeliveryMen = async () => {
        setIsLoading(true);
        try {
            const { data } = await listAllDeliveryMen();
            setDeliveryMen(data || []);
            setHasLoaded(true);
        } catch (error) {
            console.error("Error loading delivery men:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DeliveryMenContext.Provider
            value={{
                deliveryMen,
                isLoading,
                hasLoaded,
                loadDeliveryMen,
            }}
        >
            {children}
        </DeliveryMenContext.Provider>
    );
};

export const useDeliveryMen = () => {
    const context = useContext(DeliveryMenContext);
    if (context === undefined) {
        throw new Error("useDeliveryMen must be used within DeliveryMenProvider");
    }
    return context;
};
