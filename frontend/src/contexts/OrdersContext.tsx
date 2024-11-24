import { createContext, useContext, useEffect, useState } from "react";
import { getAllOrders } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";

interface OrdersContextType {
  orders: IOrder[];
  loadAvailableOrders: () => Promise<void>;
  addOrder: (client: IOrder) => void;
  editOrder: (client: IOrder) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);

  const loadAvailableOrders = async () => {
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
    loadAvailableOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, editOrder, loadAvailableOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within a ClientsProvider");
  return context;
};
