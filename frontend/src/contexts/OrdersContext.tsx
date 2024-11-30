import { createContext, useContext, useEffect, useState } from "react";
import { getAllOrders, getOnGoingOrders } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";

interface OrdersContextType {
  orders: IOrder[];
  loadAvailableOrders: () => Promise<void>;
  addOrder: (client: IOrder) => void;
  editOrder: (client: IOrder) => void;
  onGoingOrders: IOrder[];
  loadOnGoingOrders: () => Promise<void>
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [onGoingOrders, setOnGoingOrders] = useState<IOrder[]>([]);

  const loadAvailableOrders = async () => {
    if (orders.length === 0) {
      const { data: { orders } } = await getAllOrders();
      setOrders(orders);
    }
  };

  const loadOnGoingOrders = async () => {
    if (onGoingOrders.length === 0) {
      const response = await getOnGoingOrders();
      const { data: orders } = response;

      setOnGoingOrders(orders);
    }
  }

  const addOrder = (order: IOrder) => {
    setOrders((prevOrders) => [...prevOrders, order]);
    setOnGoingOrders((prevOrders) => [...prevOrders, order]);
  };
  
  const editOrder = (updatedOrder: IOrder) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );

    setOnGoingOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  useEffect(() => {
    loadAvailableOrders();
    loadOnGoingOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrdersContext.Provider value={{
        orders,
        addOrder,
        editOrder,
        loadAvailableOrders,
        onGoingOrders,
        loadOnGoingOrders,

      }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within a ClientsProvider");
  return context;
};
