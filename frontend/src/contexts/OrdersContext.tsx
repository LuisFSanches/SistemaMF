import { createContext, useContext, useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";

interface OrdersContextType {
  orders: IOrder[];
  loadAvailableClients: () => Promise<void>;
  addOrder: (client: IOrder) => void;
  editOrder: (client: IOrder) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const loadAvailableClients = async () => {
    if (orders.length === 0) {
      const { data: { orders } } = await getAllOrders();
      setOrders(orders);
    }
  };

  const addOrder = (order: IOrder) => {
    setOrders((prevClients) => [...prevClients, order]);
  };
  
  const editOrder = (updatedClient: IOrder) => {
    setOrders((prevClients) =>
      prevClients.map((order) =>
        order.id === updatedClient.id ? updatedClient : order
      )
    );
  };

  useEffect(() => {
    loadAvailableClients();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, editOrder, loadAvailableClients }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within a ClientsProvider");
  return context;
};
