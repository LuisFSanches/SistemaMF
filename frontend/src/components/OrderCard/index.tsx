import { useState } from "react";
import { IOrder } from "../../interfaces/IOrder";
import moment from "moment";
import 'moment/locale/pt-br';
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { ViewCardMessage } from "../ViewCardMessage";
import { OrderCardContainer } from "./style"
import { HAS_CARD, TYPES_OF_DELIVERY } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight, faAnglesLeft, faEye, faPen, faEnvelope, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { formatTitleCase, formatDescription } from "../../utils";
import { PAYMENT_METHODS } from "../../constants";
import { PrintOrder } from "../PrintOrder";
import { useAdmins } from "../../contexts/AdminsContext";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";

export function OrderCard({
	order,
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
	const { admins } = useAdmins();
	const { showSuccess } = useSuccessMessage();

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

	function handleOpenWhatsApp() {
		const clientName = formatTitleCase(`${order.client.first_name} ${order.client.last_name}`);
		
		// Formatar data de entrega
		const deliveryDate = moment(order.delivery_date)
			.locale('pt-br')
			.utc()
			.format("D [de] MMMM [de] YYYY [(]dddd[)]");
		
		// Formatar endereço
		let address = "";
		if (!order.pickup_on_store && order.is_delivery) {
			address = `${formatTitleCase(order.clientAddress.street)}, ${order.clientAddress.street_number}, ${formatTitleCase(order.clientAddress.complement)} ${formatTitleCase(order.clientAddress.neighborhood)}, ${formatTitleCase(order.clientAddress.city)}`;
			if (order.clientAddress.reference_point) {
				address += ` Ponto de referência: ${formatTitleCase(order.clientAddress.reference_point)}`;
			}
		} else {
			address = "Retirar na loja";
		}
		
		// Formatar produtos
		const products = formatDescription(order.description)
			.map(line => `• ${line}`)
			.join('\n');
		
		let message = "";
		
		switch (order.status) {
			case "OPENED":
				message = `📋Pedido #${order.code}*\n\n`;
				message += `✅ Olá ${clientName}, Pedido confirmado! Qualquer dúvida, estamos à disposição.🌸💝\n`;
				message += `📅 Data de Entrega:* ${deliveryDate}\n`;
				message += `📍 Endereço:* ${address}\n`;
				message += `💐 Produtos:*\n${products}\n`;
				message += `💰 Valores:*\n`;
				message += `• Produtos: R$ ${order.products_value}\n`;
				if (order.discount > 0) {
					message += `• Desconto: R$ ${order.discount}\n`;
				}
				message += `• Taxa de entrega: R$ ${order.delivery_fee}\n`;
				message += `💵 Total: R$ ${order.total}*\n`;
				message += `💳 Pagamento: ${PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS]}`;
				break;
			
			case "IN_PROGRESS":
				message = `📋 Pedido #${order.code}*\n`;
				message += `✅ Olá ${clientName}, seu pedido já está sendo preparado por nossa equipe.🎁\n`;
				message += `📅 *Data de Entrega:* ${deliveryDate}`
				break;
			
			case "IN_DELIVERY":
				message = `📋 Pedido #${order.code}*\n`;
				message += `✅ Seu pedido está em rota de entrega.🛵🛵\n`;
				message += `📅 *Data de Entrega:* ${deliveryDate}`
				break;
			
			default:
				message = `*Pedido #${order.code}*\n\n`;
				message += `Olá ${clientName}, entramos em contato sobre o seu pedido.`;
				break;
		}
		
		// Copiar mensagem para área de transferência
		navigator.clipboard.writeText(message)
			.then(() => {
				showSuccess('Mensagem copiada para área de transferência!');
			})
			.catch(() => {
				showSuccess('Erro ao copiar mensagem. Tente novamente.');
			});
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
				{!order.store_front_order && order.is_delivery &&
					<span className={`order-type ${order.online_order ? "whatsapp" : "on_store"}`}>
						{order.online_order ? "Whatsapp" : "Balcão"}
					</span>
				}

				{order.store_front_order && 
					<span className={`order-type on_site`}>
						<FontAwesomeIcon icon={faGlobe} /> Site
					</span>
				}

				{(!order.is_delivery && order.online_order) &&
					<span className={`order-type online`}>
						Online
					</span> 
				}

				{(!order.is_delivery && !order.online_order && !order.store_front_order) &&
					<span className={`order-type pdv`}>
						PDV
					</span> 
				}

				<h2>*** Pedido #{order?.code} ***</h2>
				<div>
					<FontAwesomeIcon className="edit-icon" icon={faPen} onClick={() => handleOpenEditOrderModal(order)}/>
				</div>

			</div>
			<div className="client-info">
				<div>
					<p><strong>Cliente:</strong> {formatTitleCase(order.client.first_name)} {formatTitleCase(order.client.last_name)}</p>
					{order.is_delivery &&
						<p><strong>Telefone do Cliente: </strong>{order.client.phone_number}</p>
					}
				</div>
				<p className="delivery-date"><strong>📅 Data de entrega: </strong> 
					{moment(order.delivery_date)
						.locale('pt-br')
						.utc()
						.format("D [de] MMMM [de] YYYY [(]dddd[)]")
					}
				</p>
			</div>
			<div className="order-content">
				<div className="order-items">
					<h3>📋 Descrição do pedido:</h3>
					{formatDescription(order.description).map((line, idx) => (
						<p key={idx}>{line}</p>
					))}
				</div>
			</div>
			<div className="order-card-container observation">
				<h3>Observação: </h3>
				<p>{formatTitleCase(order.additional_information)}</p>
			</div>
			<div className="order-card-container address">
				<h3><strong>📍Endereço de entrega:</strong></h3>
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
			<div className="order-card-container type-of-delivery">
				<p><strong>🛵 Tipo de Entrega: </strong>
					{TYPES_OF_DELIVERY[order.type_of_delivery as keyof typeof TYPES_OF_DELIVERY]}
				</p>
			</div>
			{order.is_delivery &&
				<div className="order-card-container receiver">
					<p><strong>Entregar para: </strong>
						{order.receiver_name ? formatTitleCase(order.receiver_name)
							: formatTitleCase(order.client.first_name)}
					</p>
					<p><strong>Telefone recebedor: </strong>
						{order.receiver_name ? order.receiver_phone : order.client.phone_number}</p>
				</div>
			}

			<div className="order-card-container card">
				<p><strong>Cartão: </strong>
					{HAS_CARD[order.has_card.toString() as keyof typeof HAS_CARD]}
				</p>
			</div>
			<div className="order-card-container order-values">
				<h3><strong>💰 Valores do pedido: </strong></h3>
				<p><strong>Valor dos produtos: </strong>R$ {order.products_value}</p>
				{order.discount > 0 &&
					<p><strong>Desconto: </strong>R$ {order.discount || 0}</p>
				}
				<p><strong>Taxa de entrega: </strong>R$ {order.delivery_fee}</p>
				<p className="total-value"><strong>Total: </strong>R$ {order.total}</p>
			</div>
			<div className="order-card-container payment-method">
				<p><strong>Método de pagamento: </strong>
					{PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS]}
				</p>
			</div>
			<div className="order-card-container order-admin">
				<p><strong>Status Pagamento: </strong>{order.payment_received ? "Pago" : "Pendente"}</p>
				<p><strong>Responsável pelo Pedido: </strong>{order.createdBy?.name || "Próprio Cliente"}</p>
			</div>
			<div className="move-order">
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
				<button className="whatsapp-button" onClick={handleOpenWhatsApp}>
					<FontAwesomeIcon icon={faWhatsapp as any}/>
					Whatsapp
				</button>
				<button className="view-button" onClick={() => handleOpenOrderDetailModal(order)}>
					<FontAwesomeIcon icon={faEye}/>
					Pedido
				</button>
				<PrintOrder
						order={order}
						orderCode={order.code}
						admins={admins}
						clientName={`${order.client.first_name} ${order.client.last_name}`}
						clientTelephone={order.client.phone_number}
						buttonLabel={'Imprimir'}
						style={{
							background: 'white',
							border: '1px solid black',
							color: '#666666',
						}}
					/>
				{((order.has_card && order.online_order) || (order.has_card && order.store_front_order)) &&
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
