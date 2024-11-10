import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Container, OrderCard} from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faPrint } from "@fortawesome/free-solid-svg-icons";
import { getOnGoingOrders } from "../../services/orderService";

export function ServiceOrdersPage(){

	const [openedOrders, setOpenedOrders] = useState([]);
	const [inProgressOrders, setInProgressOrders] = useState([]);
	const [doneOrders, setDoneOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			const response = await getOnGoingOrders();
			const { data } = response;
			setOpenedOrders(data.filter((order: any) => order.status === "OPENED"));
			setInProgressOrders(data.filter((order: any) => order.status === "IN_PROGRESS"));
			setDoneOrders(data.filter((order: any) => order.status === "DONE"));
		};

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

	console.log(openedOrders);

    return(
		<Container>
			<div className="order-container">
				<header className="opened-order">
					Ordem Aberta
				</header>
				{openedOrders.map((order: any) => (
					<div key={order.id} id={`order-card-${order.id}`}>
						<OrderCard className={order?.status?.toLowerCase()}>
							<div className="order-number">
								<h2>Pedido #{order.code}</h2>
							</div>
							<div className="client-info">
								<h3>Cliente: {order.client.first_name} {order.client.last_name}</h3>
								<h3>Realizado em: {moment(order.created_at).format("h:mm")}</h3>
							</div>
							<div className="order-content">
								<div className="order-items">
									<h3>Descrição do pedido</h3>
									<p>{order.description}</p>
								</div>
								<div className="order-observation">
									<h3>Observação</h3>
									<p>{order.additional_information}</p>
								</div>
							</div>
							<div className="address-container">
								<p><strong>Endereço:</strong></p>
								<p>{order.clientAddress.street}, {order.clientAddress.street_number}</p>
								<p>{order.clientAddress.neighborhood}, {order.clientAddress.city}</p>
							</div>
							<div className="value-container">
								<p><strong>Total:</strong> R$ {order.total}</p>
							</div>
							<div className="order-actions">
								<button className="print" onClick={() => handlePrint(`order-card-${order.id}`)}> 
									<FontAwesomeIcon icon={faPrint}/>
									<p>Imprimir</p>
								</button>

								<button className="to-production">
									<FontAwesomeIcon icon={faAnglesRight}/>
									<p>Em Produção</p>
								</button>
							</div>
						</OrderCard>
					</div>
				))}
			</div>
			<div className="order-container ">
				<header className="in-progress-order">
					Em produção
				</header>
				{inProgressOrders.map((order: any) => (
                	<div key={order.id} id={`order-card-${order.id}`}>
						<OrderCard className={order?.status?.toLowerCase()}>
							<div className="order-number">
								<h2>Pedido #{order.code}</h2>
							</div>
							<div className="client-info">
								<h3>Cliente: {order.client.first_name} {order.client.last_name}</h3>
								<h3>Realizado em: {moment(order.created_at).format("h:mm")}</h3>
							</div>
							<div className="order-content">
								<div className="order-items">
									<h3>Descrição do pedido</h3>
									<p>{order.description}</p>
								</div>
								<div className="order-observation">
									<h3>Observação</h3>
									<p>{order.additional_information}</p>
								</div>
							</div>
							<div className="address-container">
								<p><strong>Endereço:</strong></p>
								<p>{order.clientAddress.street}, {order.clientAddress.street_number}</p>
								<p>{order.clientAddress.neighborhood}, {order.clientAddress.city}</p>
							</div>
							<div className="order-actions">
								<button className="print" onClick={() => handlePrint(`order-card-${order.id}`)}> 
									<FontAwesomeIcon icon={faPrint}/>
									<p>Imprimir</p>
								</button>

								<button className="to-finished">
									<FontAwesomeIcon icon={faAnglesRight}/>
									<p>Saiu para Entrega</p>
								</button>
							</div>
						</OrderCard>
                	</div>
                ))}
			</div>
			<div className="order-container">
				<header className="finished-order">
					Rota de Entrega
				</header>
				{doneOrders.map((order: any) => (
                	<div key={order.id} id={`order-card-${order.id}`}>
						<OrderCard className={order?.status?.toLowerCase()}>
							<div className="order-number">
								<h2>Pedido #{order.code}</h2>
							</div>
							<div className="client-info">
								<h3>Cliente: {order.client.first_name} {order.client.last_name}</h3>
								<h3>Realizado em: {moment(order.created_at).format("h:mm")}</h3>
							</div>
							<div className="order-content">
								<div className="order-items">
									<h3>Descrição do pedido</h3>
									<p>{order.description}</p>
								</div>
								<div className="order-observation">
									<h3>Observação</h3>
									<p>{order.additional_information}</p>
								</div>
							</div>
							<div className="address-container">
								<p><strong>Endereço:</strong></p>
								<p>{order.clientAddress.street}, {order.clientAddress.street_number}</p>
								<p>{order.clientAddress.neighborhood}, {order.clientAddress.city}</p>
							</div>
							<div className="order-actions">
								<button className="print" onClick={() => handlePrint(`order-card-${order.id}`)}> 
									<FontAwesomeIcon icon={faPrint}/>
									<p>Imprimir</p>
								</button>

								<button className="delivered">
									<FontAwesomeIcon icon={faAnglesRight}/>
									<p>Entregue</p>
								</button>
							</div>
						</OrderCard>
                	</div>
                ))}
			</div>
		</Container>
)
}