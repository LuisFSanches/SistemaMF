import { createContext, useContext, useEffect, useState } from "react";
import { getAllOrders, getOnGoingOrders, getWaitingOrders } from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";

interface OrdersContextType {
  orders: IOrder[];
  loadAvailableOrders: () => Promise<void>;
  addOrder: (client: IOrder) => void;
  editOrder: (client: IOrder) => void;
  onGoingOrders: IOrder[];
  loadOnGoingOrders: () => Promise<void>;
  loadWaitingOrders: () => Promise<void>;
  waitingOrders: IOrder[]
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [onGoingOrders, setOnGoingOrders] = useState<IOrder[]>([]);
  const [waitingOrders, setWaitingOrders] = useState<IOrder[]>([]);
  const token = localStorage.getItem("token");

  const loadAvailableOrders = async () => {
    const { data: { orders } } = await getAllOrders();
    setOrders(orders);
  };

  const loadOnGoingOrders = async (forceLoad = false) => {
    if (onGoingOrders.length === 0 || forceLoad) {
      const response = await getOnGoingOrders();
      const { data: orders } = response;

      setOnGoingOrders(orders);
    }
  }

  const loadWaitingOrders = async () => {
    const { data: { orders } } = await getWaitingOrders();
    setOrders(orders);
    setWaitingOrders(orders);
  }

  const addOrder = (order: IOrder) => {
    setOrders((prevOrders) => [...prevOrders, order]);
    setOnGoingOrders((prevOrders) => [...prevOrders, order]);
    loadOnGoingOrders(true);
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
    if (token) {

      if (!window.location.pathname.includes('ordensDeServico')) {
        loadOnGoingOrders();
      }
    }
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
        loadWaitingOrders,
        waitingOrders
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
