import { useState, useEffect } from "react";
import moment from "moment";
import { IOrder } from "../../interfaces/IOrder";
import { Container, Orders, Header } from "./style";
import { updateStatus } from "../../services/orderService";
import { OrderCard } from "../../components/OrderCard";
import { useOrders } from "../../contexts/OrdersContext";
import { Loader } from "../../components/Loader";
import { EditOrderModal } from "../../components/EditOrderModal";

export function ServiceOrdersPage(){
	const { onGoingOrders, editOrder, loadOnGoingOrders } = useOrders();

	const [openedOrders, setOpenedOrders] = useState<IOrder[]>([]);
	const [inProgressOrders, setInProgressOrders] = useState<IOrder[]>([]);
	const [inDeliveryOrders, setInDeliveryOrders] = useState<IOrder[]>([]);
	const [showLoader, setShowLoader] = useState(false);
	const [requestOrders, setRequestOrders] = useState(false);
    const [editOrderModal, setEditOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
	const [selectedOrderType, setSelectedOrderType] = useState("all-orders");
	const [selectedDate, setSelectedDate] = useState("all-dates");


    function handleOpenEditOrderModal(order: IOrder){
        setEditOrderModal(true);
        setCurrentOrder(order);
    }

	const fetchOrders = async () => {
		setShowLoader(true);
		setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED"));
		setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS"));
		setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY"));
		setShowLoader(false);
	};

	useEffect(() => {
		fetchOrders();
		if (onGoingOrders.length === 0 && !requestOrders) {
			loadOnGoingOrders();
			setRequestOrders(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoingOrders]);

	const handleOrderStatus = async (id: string, status: string) => {
		setShowLoader(true);
		const response =await updateStatus({ id, status });
		const { data: order } = response;
		editOrder(order);
		setShowLoader(false);
	}

	const filterOrdersByType = (orderType: string) => {
		setSelectedOrderType(orderType);
		if (orderType === "counter-orders") {
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED" && !order.online_order && order.is_delivery));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS" && !order.online_order && order.is_delivery));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY" && !order.online_order && order.is_delivery));
		} else if (orderType === "online-orders") {
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED" && order.online_order));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS" && order.online_order));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY" && order.online_order));
		} else if (orderType === "store-orders") {
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED" && !order.is_delivery));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS" && !order.is_delivery));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY" && !order.is_delivery));
		}
		else {
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED"));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS"));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY"));
		}
	};

	const filterOrdersByNameOrPhone = (text: string) => {
		const lowerText = text.toLowerCase();
	
		const matches = (order: IOrder) => {
			return (
				order.client.first_name.toLowerCase().includes(lowerText) ||
				order.client.last_name.toLowerCase().includes(lowerText) ||
				order.client.phone_number.toLowerCase().includes(lowerText) ||
				// eslint-disable-next-line eqeqeq
				order.code == lowerText
			);
		};
	
		setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED" && matches(order)));
		setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS" && matches(order)));
		setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY" && matches(order)));
	};

	const filterOrdersByDate = (type: string) => {
		setSelectedDate(type);
	
		if (type === "all-dates") {
			setOpenedOrders(onGoingOrders.filter(order => order.status === "OPENED"));
			setInProgressOrders(onGoingOrders.filter(order => order.status === "IN_PROGRESS"));
			setInDeliveryOrders(onGoingOrders.filter(order => order.status === "IN_DELIVERY"));
		} else if (type === "week") {
			setOpenedOrders(onGoingOrders.filter(order =>
				order.status === "OPENED" && moment(order.delivery_date).isSame(moment(), "week")
			));
			setInProgressOrders(onGoingOrders.filter(order =>
				order.status === "IN_PROGRESS" && moment(order.delivery_date).isSame(moment(), "week")
			));
			setInDeliveryOrders(onGoingOrders.filter(order =>
				order.status === "IN_DELIVERY" && moment(order.delivery_date).isSame(moment(), "week")
			));
		} else if (type === "today") {
			setOpenedOrders(onGoingOrders.filter(order =>
				order.status === "OPENED" && moment(order.delivery_date).isSame(moment(), "day")
			));
			setInProgressOrders(onGoingOrders.filter(order =>
				order.status === "IN_PROGRESS" && moment(order.delivery_date).isSame(moment(), "day")
			));
			setInDeliveryOrders(onGoingOrders.filter(order =>
				order.status === "IN_DELIVERY" && moment(order.delivery_date).isSame(moment(), "day")
			));
		}
	};
	
	
    return (
		<Container>
			<Loader show={showLoader} />
			<Header>
				<div className="type-filters">
					<button className={`all-orders ${selectedOrderType === "all-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("all-orders")}>
							Todos
					</button>
					<button className={`counter-orders ${selectedOrderType === "counter-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("counter-orders")}>
							Ordens Balcão
					</button>
					<button className={`online-orders ${selectedOrderType === "online-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("online-orders")}>
							Ordens Online
					</button>
					<button className={`store-orders ${selectedOrderType === "store-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("store-orders")}>
						Ordens PDV
					</button>

					<input
						type="text"
						placeholder="Buscar por Nome, Telefone ou Código"
						onChange={(e) => filterOrdersByNameOrPhone(e.target.value)} />
				</div>
				<div className="date-filters">
					<button className={`all-dates ${selectedDate === "all-dates" ? "active-date" : ""}`}
						onClick={() => filterOrdersByDate("all-dates")}>
							Qualquer data
					</button>
					<button className={`all-dates ${selectedDate === "today" ? "active-date" : ""}`}
						onClick={() => filterOrdersByDate("today")}>
							Hoje
					</button>
					<button className={`all-dates ${selectedDate === "week" ? "active-date" : ""}`}
						onClick={() => filterOrdersByDate("week")}>
							Essa semana
					</button>
				</div>
 			</Header>
			<Orders>
				<div className="order-container opened">
					<header className="opened-order">
						Ordem Aberta
					</header>
					{openedOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handleOrderStatus={handleOrderStatus}
								buttonStatus="to-production"
								previousButtonStatus={null}
								nextStatus="IN_PROGRESS"
								previousStatus={null}
								nextAction="Em produção"
								previousAction={null}
								handleOpenEditOrderModal={handleOpenEditOrderModal}
							/>
						</div>
					))}
				</div>
				<div className="order-container in_progress">
					<header className="in-progress-order">
						Em produção
					</header>
					{inProgressOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handleOrderStatus={handleOrderStatus}
								buttonStatus="to-finished"
								previousButtonStatus="to-production"
								nextStatus="IN_DELIVERY"
								previousStatus="OPENED"
								nextAction="Entrega"
								previousAction="Em produção"
								handleOpenEditOrderModal={handleOpenEditOrderModal}
							/>
						</div>
					))}
				</div>
				<div className="order-container in_delivery">
					<header className="finished-order">
						Rota de Entrega
					</header>
					{inDeliveryOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handleOrderStatus={handleOrderStatus}
								buttonStatus="delivered"
								previousButtonStatus="to-finished"
								nextStatus="DONE"
								previousStatus="IN_PROGRESS"
								nextAction="Finalizado"
								previousAction="Entrega"
								handleOpenEditOrderModal={handleOpenEditOrderModal}
							/>
						</div>
					))}
				</div>
			</Orders>

			<EditOrderModal
                isOpen={editOrderModal}
                onRequestClose={() => setEditOrderModal(false)}
                order={currentOrder as any}
            />
		</Container>
	)
}
