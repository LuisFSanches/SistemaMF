import { createContext, useContext, useState } from "react";
import { 
    getAllOrderDeliveries, 
    createOrderDelivery as createOrderDeliveryService,
    updateOrderDelivery as updateOrderDeliveryService,
    deleteOrderDelivery as deleteOrderDeliveryService,
    bulkUpdateOrderDeliveries as bulkUpdateOrderDeliveriesService
} from "../services/orderDeliveryService";
import { IOrderDelivery, ICreateOrderDelivery, IUpdateOrderDelivery } from "../interfaces/IOrderDelivery";

interface OrderDeliveriesContextType {
    orderDeliveries: IOrderDelivery[];
    totalDeliveries: number;
    loadOrderDeliveries: (page: number, pageSize: number, query: string, filter?: string, startDate?: string | null, endDate?: string | null) => Promise<void>;
    createOrderDelivery: (data: ICreateOrderDelivery) => Promise<void>;
    updateOrderDelivery: (id: string, data: IUpdateOrderDelivery) => Promise<void>;
    deleteOrderDelivery: (id: string) => Promise<void>;
    bulkUpdateOrderDeliveries: (ids: string[], data: IUpdateOrderDelivery) => Promise<void>;
    isLoading: boolean;
}

const OrderDeliveriesContext = createContext<OrderDeliveriesContextType | undefined>(undefined);

export const OrderDeliveriesProvider: React.FC = ({ children }) => {
    const [orderDeliveries, setOrderDeliveries] = useState<IOrderDelivery[]>([]);
    const [totalDeliveries, setTotalDeliveries] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const loadOrderDeliveries = async (page: number, pageSize: number, query: string, filter?: string, startDate?: string | null, endDate?: string | null) => {
        setIsLoading(true);
        try {
            const { orderDeliveries, total } = await getAllOrderDeliveries(page, pageSize, query, filter, startDate, endDate);
            setOrderDeliveries(orderDeliveries);
            setTotalDeliveries(total);
        } catch (error) {
            console.error("Error loading order deliveries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const createOrderDelivery = async (data: ICreateOrderDelivery) => {
        setIsLoading(true);
        try {
            const newDelivery = await createOrderDeliveryService(data);
            if (newDelivery.errorCode === 400) {
                return;
            }
            setOrderDeliveries((prev) => [newDelivery, ...prev]);
        } catch (error) {
            console.error("Error creating order delivery:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderDelivery = async (id: string, data: IUpdateOrderDelivery) => {
        setIsLoading(true);
        try {
            const updatedDelivery = await updateOrderDeliveryService(id, data);
            setOrderDeliveries((prev) =>
                prev.map((delivery) => (delivery.id === id ? updatedDelivery : delivery))
            );
        } catch (error) {
            console.error("Error updating order delivery:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteOrderDelivery = async (id: string) => {
        setIsLoading(true);
        try {
            await deleteOrderDeliveryService(id);
            setOrderDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
        } catch (error) {
            console.error("Error deleting order delivery:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const bulkUpdateOrderDeliveries = async (ids: string[], data: IUpdateOrderDelivery) => {
        setIsLoading(true);
        try {
            const { orderDeliveries: updatedDeliveries } = await bulkUpdateOrderDeliveriesService(ids, data);
            setOrderDeliveries((prev) =>
                prev.map((delivery) => {
                    const updated = updatedDeliveries.find((d: IOrderDelivery) => d.id === delivery.id);
                    return updated ? updated : delivery;
                })
            );
        } catch (error) {
            console.error("Error bulk updating order deliveries:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OrderDeliveriesContext.Provider
            value={{
                orderDeliveries,
                totalDeliveries,
                loadOrderDeliveries,
                createOrderDelivery,
                updateOrderDelivery,
                deleteOrderDelivery,
                bulkUpdateOrderDeliveries,
                isLoading,
            }}
        >
            {children}
        </OrderDeliveriesContext.Provider>
    );
};

export const useOrderDeliveries = () => {
    const context = useContext(OrderDeliveriesContext);
    if (context === undefined) {
        throw new Error("useOrderDeliveries must be used within OrderDeliveriesProvider");
    }
    return context;
};
