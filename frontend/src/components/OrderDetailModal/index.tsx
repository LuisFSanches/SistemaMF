import Modal from 'react-modal';
import moment from 'moment';
import { IOrder } from "../../interfaces/IOrder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Container, OrderInfo } from "./style";
import { HAS_CARD, PAYMENT_METHODS, PAYMENT_RECEIVED } from "../../constants";

interface OrderDetailModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    order: IOrder
}

export function OrderDetailModal({
	order,
	isOpen,
    onRequestClose,
}: OrderDetailModalProps) {
	if (!order) {
		return null;
	}
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			overlayClassName="react-modal-overlay"
			className="react-modal-content"
		>
			<button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

			<Container>
				<h1>Pedido #{order.code}</h1>
				<OrderInfo>
					<h2>Dados do Cliente</h2>
					<p><strong>Cliente: </strong>
						{order.client.first_name} {order.client.last_name}
					</p>
					<p><strong>Telefone: </strong> {order.client.phone_number}</p>
				</OrderInfo>
				<OrderInfo>
					<h2>Dados do Recebedor</h2>
					{order.receiver_name &&
						<>
							<p><strong>Nome: </strong> {order.receiver_name}</p>
							<p><strong>Telefone: </strong>{order.receiver_phone}</p>
						</>
					}

					{!order.receiver_name &&
						<p>O próprio cliente.</p>
					}
				</OrderInfo>

				<OrderInfo>
					<h2>Informações do Pedido</h2>
					<p><strong>Descrição: </strong>{order.description}</p>
					<p><strong>Observação: </strong>{order.additional_information}</p>
					<p><strong>Cartão: </strong>
						{HAS_CARD[order.has_card.toString() as keyof typeof HAS_CARD]}
					</p>
					<p><strong>Data de Entrega: </strong>{(moment(order.delivery_date).format("DD/MM/YYYY"))}</p>
					<p><strong>Método de pagamento: </strong>{
						PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS]
					}</p>
					<p><strong>Status do Pagamento: </strong>{
						PAYMENT_RECEIVED[order.payment_received.toString() as keyof typeof PAYMENT_RECEIVED]
					}</p>
				</OrderInfo>

				<OrderInfo>
					<h2>Valor do Pedido</h2>
					<p><strong>Valor dos produtos: </strong>R$ {order.products_value}</p>
					<p><strong>Taxa de entrega: </strong>R$ {order.delivery_fee}</p>
					<p><strong>Total: </strong>R$ {order.total}</p>
				</OrderInfo>
				<OrderInfo>
					<h2>Endereço de entrega</h2>
					<p>
						{order.clientAddress.street}, {order.clientAddress.street_number}, {order.clientAddress.complement}, {order.clientAddress.neighborhood} - {order.clientAddress.city}</p>
					<p><strong>Ponto de Referência: </strong>{order.clientAddress.reference_point}</p>
				</OrderInfo>
			</Container>
		</Modal>
	)
}
