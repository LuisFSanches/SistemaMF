import { createContext, useContext, useState } from "react";
import { getAllSuppliers } from "../services/supplierService";
import { ISupplier } from "../interfaces/ISupplier";

interface SuppliersContextType {
    suppliers: ISupplier[];
    isLoading: boolean;
    hasLoaded: boolean;
    loadSuppliers: () => Promise<void>;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider: React.FC = ({ children }) => {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const loadSuppliers = async () => {
        setIsLoading(true);
        try {
            const { data } = await getAllSuppliers();
            setSuppliers(data || []);
            setHasLoaded(true);
        } catch (error) {
            console.error("Error loading suppliers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SuppliersContext.Provider
            value={{
                suppliers,
                isLoading,
                hasLoaded,
                loadSuppliers,
            }}
        >
            {children}
        </SuppliersContext.Provider>
    );
};

export const useSuppliers = () => {
    const context = useContext(SuppliersContext);
    if (context === undefined) {
        throw new Error("useSuppliers must be used within SuppliersProvider");
    }
    return context;
};
