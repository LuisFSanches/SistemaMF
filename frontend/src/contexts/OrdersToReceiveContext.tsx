import { createContext, useContext, useState } from "react";
import { 
  getAllOrdersToReceive, 
  createOrderToReceive as createOrderToReceiveService,
  updateOrderToReceive as updateOrderToReceiveService,
  deleteOrderToReceive as deleteOrderToReceiveService
} from "../services/orderToReceiveService";
import { IOrderToReceive, ICreateOrderToReceive, IUpdateOrderToReceive } from "../interfaces/IOrderToReceive";

interface OrdersToReceiveContextType {
  ordersToReceive: IOrderToReceive[];
  loadOrdersToReceive: () => Promise<void>;
  createOrderToReceive: (data: ICreateOrderToReceive) => Promise<void>;
  updateOrderToReceive: (id: string, data: IUpdateOrderToReceive) => Promise<void>;
  deleteOrderToReceive: (id: string) => Promise<void>;
  isLoading: boolean;
}

const OrdersToReceiveContext = createContext<OrdersToReceiveContextType | undefined>(undefined);

export const OrdersToReceiveProvider: React.FC = ({ children }) => {
  const [ordersToReceive, setOrdersToReceive] = useState<IOrderToReceive[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrdersToReceive = async () => {
    setIsLoading(true);
    try {
      const data = await getAllOrdersToReceive();
      setOrdersToReceive(data);
    } catch (error) {
      console.error("Error loading orders to receive:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrderToReceive = async (data: ICreateOrderToReceive) => {
    setIsLoading(true);
    try {
      const newOrder = await createOrderToReceiveService(data);
      setOrdersToReceive((prev) => [newOrder, ...prev]);
    } catch (error) {
      console.error("Error creating order to receive:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderToReceive = async (id: string, data: IUpdateOrderToReceive) => {
    setIsLoading(true);
    try {
      const updatedOrder = await updateOrderToReceiveService(id, data);
      setOrdersToReceive((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
    } catch (error) {
      console.error("Error updating order to receive:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrderToReceive = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteOrderToReceiveService(id);
      setOrdersToReceive((prev) => prev.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order to receive:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrdersToReceiveContext.Provider
      value={{
        ordersToReceive,
        loadOrdersToReceive,
        createOrderToReceive,
        updateOrderToReceive,
        deleteOrderToReceive,
        isLoading,
      }}
    >
      {children}
    </OrdersToReceiveContext.Provider>
  );
};

export const useOrdersToReceive = () => {
  const context = useContext(OrdersToReceiveContext);
  if (!context) {
    throw new Error("useOrdersToReceive must be used within OrdersToReceiveProvider");
  }
  return context;
};
