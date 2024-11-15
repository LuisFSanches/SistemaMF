import { OrderCardContainer } from "./style"
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faPrint } from "@fortawesome/free-solid-svg-icons";

export function OrderCard({
	order,
	handlePrint,
	handleOrderStatus,
	buttonStatus,
	nextStatus,
	nextAction
}: any) {
	return (
    	<OrderCardContainer className={order?.status?.toLowerCase()}>
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

				<button className={buttonStatus} onClick={() => handleOrderStatus(order.id, nextStatus)}>
					<FontAwesomeIcon icon={faAnglesRight}/>
					<p>{nextAction}</p>
				</button>
			</div>
		</OrderCardContainer>
	)
}
