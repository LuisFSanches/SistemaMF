import Modal from "react-modal";
import { IOrder } from "../../interfaces/IOrder";
import { convertMoney } from "../../utils";
import { ModalContainer } from "../../styles/global";
import { Container, ButtonGroup, ActionButton } from "../PaymentStatusModal/style";

interface DeliveryPaymentStatusModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    order: IOrder;
    onConfirmPayment: () => void;
    onCreateOrderToReceive: () => void;
}

export function DeliveryPaymentStatusModal({
    isOpen,
    onRequestClose,
    order,
    onConfirmPayment,
    onCreateOrderToReceive
}: DeliveryPaymentStatusModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
            ariaHideApp={false}
        >
            <ModalContainer>
                <button
                    type="button"
                    onClick={onRequestClose}
                    className="modal-close"
                >
                    ✕
                </button>

                <h2>Pagamento Pendente</h2>

                <Container>
                    <div className="order-info">
                        <p><strong>Pedido:</strong> #{order.code}</p>
                        <p><strong>Valor Total:</strong> {convertMoney(order.total)}</p>
                        <p className="warning">⚠️ O pagamento deste pedido está pendente.</p>
                    </div>

                    <p className="question">Você recebeu o pagamento?</p>

                    <ButtonGroup>
                        <ActionButton
                            type="button"
                            onClick={onConfirmPayment}
                            className="confirm-payment"
                        >
                            ✓ Recebi o Pagamento
                        </ActionButton>

                        <ActionButton
                            type="button"
                            onClick={onCreateOrderToReceive}
                            className="create-order"
                        >
                            ✕ Não Recebi
                        </ActionButton>
                    </ButtonGroup>
                </Container>
            </ModalContainer>
        </Modal>
    );
}
