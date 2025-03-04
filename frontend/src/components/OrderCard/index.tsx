import { useState } from "react";
import { IOrder } from "../../interfaces/IOrder";
import moment from "moment";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { OrderCardContainer } from "./style"
import { HAS_CARD } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft, faPrint, faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { formatTitleCase } from "../../utils";
export function OrderCard({
	order,
	handlePrint,
	handleOrderStatus,
	buttonStatus,
	previousButtonStatus,
	nextStatus,
	previousStatus,
	nextAction,
	previousAction,
	handleOpenEditOrderModal
}: any) {

	const [orderDetailModal, setOrderDetailModal] = useState(false);

	function handleOpenOrderDetailModal(order: IOrder){
        setOrderDetailModal(true);
    }
    function handleCloseOrderDetailModal(){
        setOrderDetailModal(false);
    }

	if (!order) {
		return <></>;
	}

	return (
    	<OrderCardContainer className={order?.status?.toLowerCase()}>
			<div className="order-number">
				<span className="order-type">Balcão</span>
				<h2>Pedido #{order?.code}</h2>
				<FontAwesomeIcon className="edit-icon" icon={faPen} onClick={() => handleOpenEditOrderModal(order)}/>
			</div>
			<div className="client-info">
				<div>
					<h3>Cliente: {order.client.first_name} {order.client.last_name}</h3>
					<p><strong>Telefone do Cliente: </strong>{order.client.phone_number}</p>
				</div>
				<h3 className="delivery-date">Data de entrega: {moment(order.delivery_date).utc().format("DD/MM/YYYY")}</h3>
			</div>
			<div className="order-content">
				<div className="order-items">
					<h3>Descrição do pedido:</h3>
					<p>{formatTitleCase(order.description)}</p>
				</div>
				<div className="order-observation">
					<h3>Observação: </h3>
					<p>{order.additional_information}</p>
				</div>
			</div>
			<div className="card-container">
				<p><strong>Cartão: </strong>
					{HAS_CARD[order.has_card.toString() as keyof typeof HAS_CARD]}
				</p>
			</div>
			<div className="address-container">
				<p><strong>Endereço:</strong></p>
				{!order.pickup_on_store && 
					<>
						<p>{formatTitleCase(order.clientAddress.street)}, {order.clientAddress.street_number},
							{formatTitleCase(order.clientAddress.complement)}
						</p>
						<p>{formatTitleCase(order.clientAddress.neighborhood)}, {formatTitleCase(order.clientAddress.city)}</p>
					</>
				}

				{order.pickup_on_store &&
					<p>Retirar na loja</p>
				}
				<p><strong>Ponto de referência: </strong>
					{formatTitleCase(order.clientAddress.reference_point)}
				</p>
			</div>
			<div className="address-container">
				<p><strong>Valor dos produtos: </strong>R$ {order.products_value}</p>
				<p><strong>Taxa de entrega: </strong>R$ {order.delivery_fee}</p>
				<p><strong>Total: </strong>R$ {order.total}</p>
			</div>
			<div className="address-container">
				<p><strong>Entregar para: </strong>
					{order.receiver_name ? formatTitleCase(order.receiver_name)
						: formatTitleCase(order.client.first_name)}
				</p>
				<p><strong>Telefone do recebedor: </strong>
					{order.receiver_name ? order.receiver_phone : order.client.phone_number}</p>
			</div>
			<div className="address-container">
				<p><strong>Status Pagamento: </strong>{order.payment_received ? "Pago" : "Pendente"}</p>
				<p><strong>Responsável pelo Pedido: </strong>{order.createdBy?.name}</p>
			</div>
			<div className="order-actions">
				{previousStatus &&
					<button className={previousButtonStatus} onClick={() => handleOrderStatus(order.id, previousStatus)}>
						<FontAwesomeIcon icon={faAnglesLeft}/>
						<p>{previousAction}</p>
					</button>
				}

				<button className={buttonStatus} onClick={() => handleOrderStatus(order.id, nextStatus)}>
					<FontAwesomeIcon icon={faAnglesRight}/>
					<p>{nextAction}</p>
				</button>
			</div>

			<div className="order-actions">
				<button className="view-button" onClick={() => handleOpenOrderDetailModal(order)}>
					Ver Pedido <FontAwesomeIcon icon={faEye}/>
				</button>
				<button className="print" onClick={() => handlePrint(`order-card-${order.id}`)}> 
					<FontAwesomeIcon icon={faPrint}/>
					<p>Imprimir</p>
				</button>
			</div>

			<OrderDetailModal
				isOpen={orderDetailModal}
				onRequestClose={handleCloseOrderDetailModal}
				order={order}
			/>

		</OrderCardContainer>
	)
}
