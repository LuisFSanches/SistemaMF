import { useState } from "react";
import { IOrder } from "../../interfaces/IOrder";
import moment from "moment";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { ViewCardMessage } from "../ViewCardMessage";
import { OrderCardContainer } from "./style"
import { HAS_CARD, TYPES_OF_DELIVERY } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft, faPrint, faEye, faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";
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
	const [viewCardMessage, setViewCardMessage] = useState(false);

	function handleOpenOrderDetailModal(order: IOrder){
        setOrderDetailModal(true);
    }
    function handleCloseOrderDetailModal(){
        setOrderDetailModal(false);
    }

	function handleOpenViewCardMessage(order: IOrder){
		setViewCardMessage(true);
	}

	function handleCloseViewCardMessage(){
		setViewCardMessage(false);
	}

	if (!order) {
		return <></>;
	}

	return (
    	<OrderCardContainer className={order?.status?.toLowerCase()}>
			<div className="order-number">
				<span className={`order-type ${order.online_order ? "online" : "on_store"}`}>
					{order.online_order ? "Online" : "Balcão"}
				</span>
				<h2>Pedido #{order?.code}</h2>
				<FontAwesomeIcon className="edit-icon" icon={faPen} onClick={() => handleOpenEditOrderModal(order)}/>
			</div>
			<div className="client-info">
				<div>
					<h3>Cliente: {formatTitleCase(order.client.first_name)} {formatTitleCase(order.client.last_name)}</h3>
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
					<p>{formatTitleCase(order.additional_information)}</p>
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
					{!order.pickup_on_store &&
						formatTitleCase(order.clientAddress.reference_point)
					}
				</p>
			</div>
			<div className="address-container">
				<p><strong>Tipo de Entrega: </strong>
					{TYPES_OF_DELIVERY[order.type_of_delivery as keyof typeof TYPES_OF_DELIVERY]}
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
					<FontAwesomeIcon icon={faEye}/>
					Pedido
				</button>
				<button className="print" onClick={() => handlePrint(`order-card-${order.id}`)}> 
					<FontAwesomeIcon icon={faPrint}/>
					<p>Imprimir</p>
				</button>
				{order.has_card &&
					<button className="view-button" onClick={() => handleOpenViewCardMessage(order)}> 
						<FontAwesomeIcon icon={faEnvelope}/>
						<p>Cartão</p>
					</button>
				}
			</div>

			<ViewCardMessage
				isOpen={viewCardMessage}
				onRequestClose={handleCloseViewCardMessage}
				order={order}
			/>

			<OrderDetailModal
				isOpen={orderDetailModal}
				onRequestClose={handleCloseOrderDetailModal}
				order={order}
			/>

		</OrderCardContainer>
	)
}
