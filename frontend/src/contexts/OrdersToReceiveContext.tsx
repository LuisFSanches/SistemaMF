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
  totalOrders: number;
  loadOrdersToReceive: (page: number, pageSize: number, query: string) => Promise<void>;
  createOrderToReceive: (data: ICreateOrderToReceive) => Promise<void>;
  updateOrderToReceive: (id: string, data: IUpdateOrderToReceive) => Promise<void>;
  deleteOrderToReceive: (id: string) => Promise<void>;
  isLoading: boolean;
}

const OrdersToReceiveContext = createContext<OrdersToReceiveContextType | undefined>(undefined);

export const OrdersToReceiveProvider: React.FC = ({ children }) => {
  const [ordersToReceive, setOrdersToReceive] = useState<IOrderToReceive[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrdersToReceive = async (page: number, pageSize: number, query: string) => {
    setIsLoading(true);
    try {
      const { ordersToReceive, total } = await getAllOrdersToReceive(page, pageSize, query);
      setOrdersToReceive(ordersToReceive);
      setTotalOrders(total);
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
      if (newOrder.errorCode === 400) {
          return;
      }
      setOrdersToReceive((prev) => [newOrder, ...prev]);
    } catch (error) {
      console.error("Error creating order to receive:", error);
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
        totalOrders,
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
