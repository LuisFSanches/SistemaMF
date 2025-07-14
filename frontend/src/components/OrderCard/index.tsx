import { useState } from "react";
import { IOrder } from "../../interfaces/IOrder";
import moment from "moment";
import 'moment/locale/pt-br';
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { ViewCardMessage } from "../ViewCardMessage";
import { OrderCardContainer } from "./style"
import { HAS_CARD, TYPES_OF_DELIVERY } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft, faPrint, faEye, faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { formatTitleCase, formatDescription } from "../../utils";
import { PAYMENT_METHODS } from "../../constants";

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
			<div className="order-header">
				<h1 className="store-title">MIRAI FLORES</h1>
				<p>CNPJ: 33.861.078/0001-50</p>
				<p>Tel: (22) 99751-7940 | Itaperuna/RJ</p>
			</div>
			<div className="order-number">
				{order.is_delivery &&
					<span className={`order-type ${order.online_order ? "online" : "on_store"}`}>
						{order.online_order ? "Online" : "Balcão"}
					</span>
				}

				{!order.is_delivery &&
					<span className={`order-type pdv`}>
						PDV
					</span> 
				}

				<h2>*** Pedido #{order?.code} ***</h2>
				<FontAwesomeIcon className="edit-icon" icon={faPen} onClick={() => handleOpenEditOrderModal(order)}/>
			</div>
			<div className="client-info">
				<div>
					<p><strong>Cliente:</strong> {formatTitleCase(order.client.first_name)} {formatTitleCase(order.client.last_name)}</p>
					{order.is_delivery &&
						<p><strong>Telefone do Cliente: </strong>{order.client.phone_number}</p>
					}
				</div>
				<p className="delivery-date"><strong>Data de entrega: </strong> 
					{moment(order.delivery_date)
						.locale('pt-br')
						.utc()
						.format("D [de] MMMM [de] YYYY [(]dddd[)]")
					}
				</p>
			</div>
			<div className="order-content">
				<div className="order-items">
					<h3>Descrição do pedido:</h3>
					{formatDescription(order.description).map((line, idx) => (
						<p key={idx}>{line}</p>
					))}
				</div>
				<div className="order-observation">
					<h3>Observação: </h3>
					<p>{formatTitleCase(order.additional_information)}</p>
				</div>
			</div>
			<div className="address-container">
				<h3><strong>Endereço de entrega:</strong></h3>
				{(!order.pickup_on_store && order.is_delivery) && 
					<>
						<p>{formatTitleCase(order.clientAddress.street)}, {order.clientAddress.street_number},
							{formatTitleCase(order.clientAddress.complement)}
						</p>
						<p>{formatTitleCase(order.clientAddress.neighborhood)}, {formatTitleCase(order.clientAddress.city)}</p>
					</>
				}

				{(order.pickup_on_store || !order.is_delivery) &&
					<p>Retirar na loja</p>
				}
				{order.is_delivery &&
					<p>Ponto de referência:
						{!order.pickup_on_store &&
							formatTitleCase(order.clientAddress.reference_point)
						}
					</p>
				}
	
			</div>
			<div className="address-container">
				<p><strong>Tipo de Entrega: </strong>
					{TYPES_OF_DELIVERY[order.type_of_delivery as keyof typeof TYPES_OF_DELIVERY]}
				</p>
			</div>
			{order.is_delivery &&
				<div className="address-container">
					<p><strong>Entregar para: </strong>
						{order.receiver_name ? formatTitleCase(order.receiver_name)
							: formatTitleCase(order.client.first_name)}
					</p>
					<p><strong>Telefone do recebedor: </strong>
						{order.receiver_name ? order.receiver_phone : order.client.phone_number}</p>
				</div>
			}

			<div className="card-container">
				<p><strong>Cartão: </strong>
					{HAS_CARD[order.has_card.toString() as keyof typeof HAS_CARD]}
				</p>
			</div>
			<div className="address-container order-values">
				<h3><strong>Valores do pedido: </strong></h3>
				<p><strong>Valor dos produtos: </strong>R$ {order.products_value}</p>
				<p><strong>Taxa de entrega: </strong>R$ {order.delivery_fee}</p>
				<p><strong>Total: </strong>R$ {order.total}</p>
			</div>
			<div className="address-container">
				<p><strong>Método de pagamento: </strong>
					{PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS]}
				</p>
			</div>
			<div className="address-container order-admin">
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
				{(order.has_card && order.online_order) &&
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
