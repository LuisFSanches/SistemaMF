import { useState } from "react";
import Modal from 'react-modal';
import moment from 'moment';
import { IOrder } from "../../interfaces/IOrder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Container, OrderInfo } from "./style";
import { HAS_CARD, PAYMENT_METHODS, PAYMENT_RECEIVED, TYPES_OF_DELIVERY } from "../../constants";
import { formatTitleCase } from "../../utils";

const baseUrl = process.env.REACT_APP_URL;

interface OrderDetailModalProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    order: IOrder;
	isOnlineOrder?: boolean;
}

export function OrderDetailModal({
	order,
	isOpen,
    onRequestClose,
	isOnlineOrder
}: OrderDetailModalProps) {
	const [copied, setCopied] = useState(false);

	if (!order) {
		return null;
	}

	const handleCopy = (orderLink: string) => {
        const message = `Você poderia preencher esse link com o endereço completo prfv? E nele também tem um espacinho para você enviar um cartão. ✉️❤️\n${orderLink}`;

        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

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

			{isOnlineOrder &&
				<Container>
					<h1>Pedido Online</h1>
					<OrderInfo>
						<h2>Link do pedido: </h2>
						<p>{baseUrl}completarPedido/{order.id}</p>
						<button
							type="button"
							onClick={()=>handleCopy(`${baseUrl}completarPedido/${order.id}`)}
							style={{
								padding: "4px 8px",
								backgroundColor: "#e7b7c2",
								border: "none",
								borderRadius: "5px",
								cursor: "pointer",
								color: 'white',
								fontSize: '15px'
							}}
						>
							Copiar link
						</button>
						{copied && (
							<span style={{ color: "gray", fontWeight: "300", marginLeft: '10px' }}>
								Link copiado!
							</span>
						)}
					</OrderInfo>
				</Container>
			}

			{!isOnlineOrder &&
				<Container>
					<h1>Pedido #{order.code}</h1>
					<OrderInfo>
						<h2>Dados do Cliente</h2>
							<>
								<p><strong>Cliente: </strong>
									{formatTitleCase(order.client.first_name)} {formatTitleCase(order.client.last_name)}
								</p>
								{order.client.last_name !== 'Balcão' &&
								<p><strong>Telefone: </strong> {order.client.phone_number}</p>
								}
							</>
					</OrderInfo>
					<OrderInfo>
						<h2>Dados do Recebedor</h2>
						{order.receiver_name &&
							<>
								<p><strong>Nome: </strong> {formatTitleCase(order.receiver_name)}</p>
								<p><strong>Telefone: </strong>{order.receiver_phone}</p>
							</>
						}

						{!order.receiver_name &&
							<p>O próprio cliente.</p>
						}
					</OrderInfo>

					<OrderInfo>
						<h2>Informações do Pedido</h2>
						<p><strong>Descrição: </strong>{formatTitleCase(order.description)}</p>
						<p><strong>Observação: </strong>{formatTitleCase(order.additional_information)}</p>
						<p><strong>Cartão: </strong>
							{HAS_CARD[order.has_card.toString() as keyof typeof HAS_CARD]}
						</p>
						<p><strong>Data de Entrega: </strong>
							<span className="delivery-date"> 
								{moment(order.delivery_date)
								.locale('pt-br')
								.utc()
								.format("D [de] MMMM [de] YYYY [(]dddd[)]")}
							</span>
						</p>
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
						<p><strong>Desconto: </strong>R$ {order.discount || 0}</p>
						<p><strong>Taxa de entrega: </strong>R$ {order.delivery_fee}</p>
						<p><strong>Total: </strong>R$ {order.total}</p>
					</OrderInfo>
					<OrderInfo>
						{order.is_delivery &&
							<p><strong>Tipo de Entrega: </strong>
								{TYPES_OF_DELIVERY[order.type_of_delivery as keyof typeof TYPES_OF_DELIVERY]}
							</p>
						}
					</OrderInfo>
					<OrderInfo>
						<h2>Endereço de entrega</h2>
						<p>
							{formatTitleCase(order.clientAddress.street)},{order.clientAddress.street_number},
							{formatTitleCase(order.clientAddress.complement)},
							{formatTitleCase(order.clientAddress.neighborhood)} - {formatTitleCase(order.clientAddress.city)}</p>
						<p><strong>Ponto de Referência: </strong>{formatTitleCase(order.clientAddress.reference_point as string)}</p>
					</OrderInfo>
				</Container>
				}
		</Modal>
	)
}
