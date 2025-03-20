import { useState } from "react";
import { IOrder } from "../../interfaces/IOrder";
import moment from "moment";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import {
	OrderItem,
	OrderHeader,
	OrderInfo,
	ActionsContainer,
	MoveButton,
	ActionButton,
	OrderStatus,
	ExpandedContent,
	OrderType
} from "./style"
import { HAS_CARD } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft, faPrint, faEye, faPen, faAnglesUp, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { formatTitleCase } from "../../utils";
export function OrderCard({
	order,
	handlePrint,
	handleOrderStatus,
	nextStatus,
	previousStatus,
	nextAction,
	previousAction,
	handleOpenEditOrderModal
}: any) {

	const [orderDetailModal, setOrderDetailModal] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);

	const getStatusTranslation = (status: string): string => {
		switch (status) {
			case 'OPENED':
				return 'Ordem Aberta';
			case 'IN_PROGRESS':
				return 'Em produção';
			case 'IN_DELIVERY':
				return 'Em entrega';
			default:
			return status;
		}
	};

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
		<OrderItem>
			<OrderHeader>
				<div className="order-info">
					<OrderInfo><strong>Pedido #{order.code}</strong></OrderInfo>
					<OrderInfo><strong>Cliente: </strong> {order.client.first_name} {order.client.last_name}</OrderInfo>
					<OrderInfo><strong>Telefone: </strong> {order.client.phone_number}</OrderInfo>
					<OrderStatus status={order.status}>Status: {getStatusTranslation(order.status)}</OrderStatus>
				</div>
				<div className="order-info">
					<p>Entrega: {moment(order.delivery_date).format("DD/MM/YYYY")}</p>
					<p>Total: R$ {order.total}</p>
					<p>Status do pagamento:
						<strong style={{ color: order.payment_received ? "green" : "red" }}>
							{order.payment_received ? "Pago" : "Pendente"}
						</strong>
					</p>
				</div>
				<OrderType isOnlineOrder={order.online_order}>
					<span>{order.online_order ? "Online" : "Balcão"}</span>
				</OrderType>
			</OrderHeader>

			<ActionsContainer>
				<div>
					<MoveButton onClick={() => setIsExpanded(!isExpanded)}>
						{isExpanded ? (
							<>
								<span>Ocultar</span>
								<FontAwesomeIcon icon={faAnglesUp} />
							</>
						) : (
							<>
								<span>Expandir</span>
								<FontAwesomeIcon icon={faAnglesDown} />
							</>
						)}
					</MoveButton>
					<div className="order-actions">
						{(order.status !== "OPENED" && previousStatus) &&
							<MoveButton className="status-button" onClick={() => handleOrderStatus(order.id, previousStatus)}>
								<FontAwesomeIcon icon={faAnglesLeft}/>
								<span>{previousAction}</span>
							</MoveButton>
						}

						<MoveButton className="status-button" onClick={() => handleOrderStatus(order.id, nextStatus)}>
							<span>{nextAction}</span>
							<FontAwesomeIcon icon={faAnglesRight}/>
						</MoveButton>
					</div>
				</div>
				<div>
					<ActionButton onClick={() => handleOpenEditOrderModal(order)}>
						<FontAwesomeIcon icon={faPen} />
						<span>Editar</span>
					</ActionButton>
					<ActionButton onClick={() => handleOpenOrderDetailModal(order)}>
						<FontAwesomeIcon icon={faEye} />
						<span>Visualizar</span>
					</ActionButton>
					<ActionButton onClick={() => handlePrint(`order-card-${order.id}`)}>
						<FontAwesomeIcon icon={faPrint} />
						<span>Imprimir</span>
					</ActionButton>
				</div>
			</ActionsContainer>
			<ExpandedContent className="expanded-content" style={{ display: isExpanded ? "block" : "none" }}>
				<div className="expanded-container">
					<OrderInfo>
						<strong	>Descrição do pedido:</strong>
						<p>{formatTitleCase(order.description)}</p>
					</OrderInfo>
					<OrderInfo>
						<strong>Observação: </strong>
						<p>{formatTitleCase(order.additional_information)}</p>
					</OrderInfo>
					<OrderInfo>
						<p><strong>Cartão: </strong>
							{HAS_CARD[order.has_card.toString() as keyof typeof HAS_CARD]}
						</p>
					</OrderInfo>
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
					</div>
					<OrderInfo>
						<p><strong>Ponto de referência: </strong>
								{!order.pickup_on_store &&
									formatTitleCase(order.clientAddress.reference_point)
								}
						</p>
					</OrderInfo>
				</div>
				<div className="expanded-container">
					<OrderInfo>
						<p><strong>Valor dos produtos: </strong>R$ {order.products_value}</p>
						<p><strong>Taxa de entrega: </strong>R$ {order.delivery_fee}</p>
						<p><strong>Total: </strong>R$ {order.total}</p>
					</OrderInfo>
					<OrderInfo>
						<p><strong>Entregar para: </strong>
							{order.receiver_name ? formatTitleCase(order.receiver_name)
								: formatTitleCase(order.client.first_name)}
						</p>
						<p><strong>Telefone do recebedor: </strong>
							{order.receiver_name ? order.receiver_phone : order.client.phone_number}</p>
					</OrderInfo>
					<OrderInfo>
						<p><strong>Responsável pelo Pedido: </strong>{order.createdBy?.name}</p>
					</OrderInfo>
				</div>
			</ExpandedContent>
			<OrderDetailModal
				isOpen={orderDetailModal}
				onRequestClose={handleCloseOrderDetailModal}
				order={order}
			/>
		</OrderItem>
	);
}
