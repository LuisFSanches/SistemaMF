import { useState, useEffect } from "react";
import { IOrder } from "../../interfaces/IOrder";
import { Container, Orders } from "./style";
import { updateStatus } from "../../services/orderService";
import { OrderCard } from "../../components/OrderCard";
import { useOrders } from "../../contexts/OrdersContext";
import { Loader } from "../../components/Loader";
import { EditOrderModal } from "../../components/EditOrderModal";

export function ServiceOrdersPage(){
	const { onGoingOrders, editOrder, loadOnGoingOrders } = useOrders();

	const [orders, setOrders] = useState<IOrder[]>(onGoingOrders);
	const [showLoader, setShowLoader] = useState(false);
	const [requestOrders, setRequestOrders] = useState(false);
    const [editOrderModal, setEditOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
	const [selectedOrderType, setSelectedOrderType] = useState<string>("all-orders");
	const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("all-status");

    function handleOpenEditOrderModal(order: IOrder){
        setEditOrderModal(true);
        setCurrentOrder(order);
    }

	const fetchOrders = async () => {
		setShowLoader(true);
		setShowLoader(false);
	};

	useEffect(() => {
		fetchOrders();
		if (onGoingOrders.length === 0 && !requestOrders) {
			loadOnGoingOrders();
			setRequestOrders(true);
		}
		setOrders(onGoingOrders);
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

								.order-actions, .edit-icon, .order-type, .message-content, button {
									display: none;
								}

								p, h3 {
									margin: 10px 0;
									font-size: 16px;
								}

								strong {
									font-size: 16px;
								}

								h3 {
									font-weight: 500;
								}

								.expanded-content {
									display: block !important;
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

	const getNextOrderStatus = (status: string) => {
		switch (status) {
			case "OPENED":
				return {
					status: "IN_PROGRESS",
					action: "Produção"
				};
			case "IN_PROGRESS":
				return {
					status: "IN_DELIVERY",
					action: "Entrega"
				};
			case "IN_DELIVERY":
				return {
					status: "DELIVERED",
					action: "Finalizado"
				};
			default:
				return {
					status: "OPENED",
					action: "Ordem Aberta"
				};
		}
	};

	const getPreviousOrderStatus = (status: string) => {
		switch (status) {
			case "IN_DELIVERY":
				return {
					status: "IN_PROGRESS",
					action: "Produção"
				};
			case "IN_PROGRESS":
				return {
					status: "OPENED",
					action: "Ordem Aberta"
				};
			default:
				return {
					status: "OPENED",
					action: "Ordem Aberta"
				};
		}
	};

	const filterOrders = (type: string, status: string) => {
		const filtered = onGoingOrders.filter((order: IOrder) => {
			const matchesType =
			type === "all-orders"
				? true
				: type === "counter-orders"
				? !order.online_order
				: order.online_order;
		
			const matchesStatus = status === "all-status" ? true : order.status === status;
		
			return matchesType && matchesStatus;
		});
		
		setOrders(filtered);
	};

	const filterOrdersByType = (type: string) => {
		setSelectedOrderType(type);
		filterOrders(type, selectedOrderStatus);
	};

	const filterByOrderStatus = (status: string) => {
		setSelectedOrderStatus(status);
		filterOrders(selectedOrderType, status);
	};
    return (
		<Container>
			<header>
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
				<select onChange={(e) => filterByOrderStatus(e.target.value)}>
					<option value={"all-status"}>Todos</option>
					<option value={"OPENED"}>Abertas</option>
					<option value={"IN_PROGRESS"}>Em produção</option>
					<option value={"IN_DELIVERY"}>Em entrega</option>
				</select>
			</header>
			<Orders>
				<Loader show={showLoader} />
				<div className="order-container">
					{orders.map((order: any) => {
						const { status: nextStatus, action: nextAction } = getNextOrderStatus(order.status);
						const { status: previousStatus, action: previousAction } = getPreviousOrderStatus(order.status);
						return (
							<div key={order.id} id={`order-card-${order.id}`}>
								<OrderCard order={order}
									handlePrint={handlePrint}
									handleOrderStatus={handleOrderStatus}
									buttonStatus="to-production"
									previousButtonStatus={null}
									nextStatus={nextStatus}
									previousStatus={previousStatus}
									nextAction={nextAction}
									previousAction={previousAction}
									handleOpenEditOrderModal={handleOpenEditOrderModal}
								/>
							</div>
						)
					})}
				</div>
				<EditOrderModal
					isOpen={editOrderModal}
					onRequestClose={() => setEditOrderModal(false)}
					order={currentOrder as any}
				/>
			</Orders>
		</Container>
	)
}
