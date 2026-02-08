import { PrintCardMessage } from '../PrintCardMessage';
import { IOrder } from "../../interfaces/IOrder";

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
		<PrintCardMessage
			card_message={order.card_message as string}
			card_from={order.card_from as string}
			card_to={order.card_to as string}
			order_code={order.code as string}
			isOpen={isOpen}
			onRequestClose={onRequestClose}
		/>
	)
}
