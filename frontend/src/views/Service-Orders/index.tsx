import { useState, useEffect, useRef } from "react";
import { Container } from "./style";
import { getOnGoingOrders, updateStatus } from "../../services/orderService";
import { OrderCard } from "../../components/OrderCard";

export function ServiceOrdersPage(){
	const [openedOrders, setOpenedOrders] = useState([]);
	const [inProgressOrders, setInProgressOrders] = useState([]);
	const [inDeliveryOrders, setInDeliveryOrders] = useState([]);

	const fetchOrders = async () => {
		const response = await getOnGoingOrders();
		const { data } = response;
		setOpenedOrders(data.filter((order: any) => order.status === "OPENED"));
		setInProgressOrders(data.filter((order: any) => order.status === "IN_PROGRESS"));
		setInDeliveryOrders(data.filter((order: any) => order.status === "IN_DELIVERY"));
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handlePrint = (orderCardId: string) => {
		const orderCard = document.getElementById(orderCardId);
		if (orderCard) {
			const printWindow = window.open('', '_blank');
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
		await updateStatus({ id, status });
		await fetchOrders();
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
							nextStatus="IN_PROGRESS"
							nextAction="Em produção"
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
							nextStatus="IN_DELIVERY"
							nextAction="Entrega"
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
							nextStatus="DONE"
							nextAction="Finalizado"
						/>
          			</div>
          		))}
			</div>
		</Container>
	)
}
