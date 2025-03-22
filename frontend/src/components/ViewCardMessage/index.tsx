import Modal from 'react-modal';
import { PrintCardMessage } from '../PrintCardMessage';
import { IOrder } from "../../interfaces/IOrder";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Container, OrderInfo } from "./style";
import { formatTitleCase } from "../../utils";

interface ViewCardMessageProps{
    isOpen: boolean;
    onRequestClose: ()=> void;
    order: IOrder;
}

export function ViewCardMessage({
	order,
	isOpen,
    onRequestClose,
}: ViewCardMessageProps) {
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

			<PrintCardMessage
				card_message={order.card_message as string}
				card_from={order.card_from as string}
				card_to={order.card_to as string}
				order_code={order.code as string}
			/>

			<Container>
				<h1>Pedido #{order.code}</h1>
				<OrderInfo>
					<p><strong>De: </strong>
						{formatTitleCase(order.card_from as string)}
					</p>
					<p><strong>Para: </strong> {order.card_to as string}</p>
					<p>{order.card_message}</p>
				</OrderInfo>
			</Container>
		</Modal>
	)
}
