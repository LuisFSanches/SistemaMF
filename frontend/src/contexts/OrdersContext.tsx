import { createContext, useContext, useEffect, useState } from "react";
import { getAllOrders, getOnGoingOrders, getWaitingOrders } from "../services/orderService";
import { useOrderSocket } from '../hooks/useOrderSocket';
import { IOrder } from "../interfaces/IOrder";
import { PUBLIC_ROUTES } from "../constants";

interface OrdersContextType {
  orders: IOrder[];
  totalOrders: number;
  loadAvailableOrders: (page: number, pageSize: number, query: string, startDate?: string | null, endDate?: string | null) => Promise<IOrder[]>;
  addOrder: (client: IOrder) => void;
  editOrder: (client: IOrder) => void;
  onGoingOrders: IOrder[];
  loadOnGoingOrders: (forceLoad: boolean) => Promise<void>;
  loadWaitingOrders: () => Promise<void>;
  waitingOrders: IOrder[]
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [onGoingOrders, setOnGoingOrders] = useState<IOrder[]>([]);
  const [waitingOrders, setWaitingOrders] = useState<IOrder[]>([]);
  const token = localStorage.getItem("token");

  const loadAvailableOrders = async (page: number, pageSize: number, query: string, startDate?: string | null, endDate?: string | null) => {
    const { data: { orders, total } } = await getAllOrders(page, pageSize, query, startDate, endDate);
    setOrders(orders);
    setTotalOrders(total);
    return orders;
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

    useOrderSocket((data: any, eventType: string) => {
      console.log('New order received via socket:', data);
      console.log('Event type:', eventType);
      
      if (eventType === 'whatsappOrder' && window.location.href.includes('backoffice')) {
          window.dispatchEvent(new CustomEvent('new-order', {
            detail: {
              message: '💐 Novo Pedido via link recebido!',
              orderCode: `#${data.code}`,
              clientName: `${data.client.first_name} ${data.client.last_name}`,
            }
        }));
      }

        if (eventType === 'storeFrontOrder' && !window.location.href.includes('completarPedido')) {
          window.dispatchEvent(new CustomEvent('new-order', {
            detail: {
              message: '💐 Novo Pedido via loja online recebido!',
              orderCode: `#${data.code}`,
              clientName: `${data.client.first_name} ${data.client.last_name}`,
            }
        }));
      }

        if (eventType === 'orderDelivered' && window.location.href.includes('backoffice')) {
          window.dispatchEvent(new CustomEvent('order-delivered', {
            detail: {
              message: '✅ Pedido entregue pelo motoboy! 🛵',
              orderCode: `#${data.order.code}`,
              deliveryMan: `${data.deliveryMan.name}`,
              clientName: `${data.order.client.first_name} ${data.order.client.last_name}`,
            }
        }));
      }

        loadOnGoingOrders(true);
    })

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      window.location.pathname === '/' || window.location.pathname.includes(route)
    );
    
    if (token && !isPublicRoute) {
      if (!window.location.pathname.includes('ordensDeServico')) {
        loadOnGoingOrders();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OrdersContext.Provider value={{
        orders,
        totalOrders,
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
