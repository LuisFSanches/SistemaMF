import { useState, useEffect } from "react";
import { IOrder } from "../../interfaces/IOrder";
import { Container } from "./style";
import { updateStatus } from "../../services/orderService";
import { OrderCard } from "../../components/OrderCard";
import { useOrders } from "../../contexts/OrdersContext";

export function ServiceOrdersPage(){
	const { onGoingOrders, editOrder } = useOrders();

	const [openedOrders, setOpenedOrders] = useState<IOrder[]>([]);
	const [inProgressOrders, setInProgressOrders] = useState<IOrder[]>([]);
	const [inDeliveryOrders, setInDeliveryOrders] = useState<IOrder[]>([]);

	const fetchOrders = async () => {
		setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED"));
		setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS"));
		setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY"));
	};

	useEffect(() => {
		fetchOrders();
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

								.order-actions {
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
		const response =await updateStatus({ id, status });
		const { data: order } = response;
		editOrder(order);
	}

    return (
		<Container>
			<div className="order-container">
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
						/>
					</div>
				))}
			</div>
			<div className="order-container ">
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
						/>
            		</div>
            	))}
			</div>
			<div className="order-container">
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
						/>
          			</div>
          		))}
			</div>
		</Container>
	)
}
