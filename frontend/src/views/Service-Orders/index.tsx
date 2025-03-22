import { useState, useEffect } from "react";
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

	const handlePrint = (orderCardId: string) => {
		const orderCard = document.getElementById(orderCardId);
		if (orderCard) {
			const printWindow = window.open('', '', 'height=840,width=1100');
			printWindow?.document.write(`
				<html>
					<head>
						<title>Imprimir Pedido</title>
						<style>
							/* Adicione aqui seu CSS para estilizar a impressão */
							body {
								font-family: Arial, sans-serif;
								margin: 0;
								padding: 20px;

								.order-actions, .edit-icon, .order-type, .message-content {
									display: none;
								}
							}
						</style>
					</head>
					<body>
						${orderCard.outerHTML}
					</body>
				</html>
			`);
			printWindow?.document.close();
			printWindow?.print();
		}
	};

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
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED" && !order.online_order));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS" && !order.online_order));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY" && !order.online_order));
		} else if (orderType === "online-orders") {
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED" && order.online_order));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS" && order.online_order));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY" && order.online_order));
		} else {
			setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED"));
			setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS"));
			setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY"));
		}
	};

    return (
		<Container>
			<Loader show={showLoader} />
			<Header>
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
 			</Header>
			<Orders>
				<div className="order-container opened">
					<header className="opened-order">
						Ordem Aberta
					</header>
					{openedOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handlePrint={handlePrint}
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
								handlePrint={handlePrint}
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
								handlePrint={handlePrint}
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
