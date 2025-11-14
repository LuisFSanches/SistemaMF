import { useState } from "react";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { IOrder } from "../../interfaces/IOrder";
import { ICreateOrderToReceive } from "../../interfaces/IOrderToReceive";
import { convertMoney } from "../../utils";
import { ORDERS_TO_RECEIVE_TYPES } from "../../constants";
import {
    ModalContainer,
    Form,
    FormField,
    Label,
    Input,
    Select,
    PrimaryButton
} from "../../styles/global";
import { Container, ButtonGroup, ActionButton, HeaderContainer } from "./style";

interface ICreateOrderToReceiveForm {
    type: string;
    payment_due_date: string;
    notes?: string;
}

interface PaymentStatusModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    order: IOrder;
    onConfirmPayment: () => void;
    onCreateOrderToReceive: (data: ICreateOrderToReceive) => void;
}

export function PaymentStatusModal({
    isOpen,
    onRequestClose,
    order,
    onConfirmPayment,
    onCreateOrderToReceive
}: PaymentStatusModalProps) {
    const [selectedAction, setSelectedAction] = useState<"payment" | "create" | null>(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ICreateOrderToReceiveForm>();

    const handleClose = () => {
        setSelectedAction(null);
        reset();
        onRequestClose();
    };

    const handlePaymentConfirmation = () => {
        onConfirmPayment();
        handleClose();
    };

    const onSubmit = (data: ICreateOrderToReceiveForm) => {
        onCreateOrderToReceive({
            ...data,
            order_id: order.id!,
        });
        handleClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
            ariaHideApp={false}
        >
            <ModalContainer>
                <button
                    type="button"
                    onClick={handleClose}
                    className="modal-close"
                >
                    ✕
                </button>

                <h2>Pagamento Pendente</h2>
                
                {!selectedAction ? (
                    <Container>
                        <div className="order-info">
                            <p><strong>Pedido:</strong> #{order.code}</p>
                            <p><strong>Cliente:</strong> {order.client.first_name} {order.client.last_name}</p>
                            <p><strong>Valor Total:</strong> {convertMoney(order.total)}</p>
                            <p className="warning">⚠️ O pagamento deste pedido está pendente.</p>
                        </div>

                        <p className="question">O que deseja fazer?</p>

                        <ButtonGroup>
                            <ActionButton
                                type="button"
                                onClick={handlePaymentConfirmation}
                                className="confirm-payment"
                            >
                                ✓ Confirmar Pagamento Recebido
                            </ActionButton>

                            <ActionButton
                                type="button"
                                onClick={() => setSelectedAction("create")}
                                className="create-order"
                            >
                                📋 Criar Valor a Receber
                            </ActionButton>
                        </ButtonGroup>
                    </Container>
                ) : (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <HeaderContainer>
                            <button
                                type="button"
                                onClick={() => setSelectedAction(null)}
                                className="cancel"
                            >
                                <FontAwesomeIcon icon={faArrowLeft}/>
                            </button>
                            <h3>Criar Valor a Receber</h3>
                        </HeaderContainer>
                        
                        <FormField>
                            <Label>
                                Tipo de Recebimento <span>*</span>
                            </Label>
                            <Select
                                isEditField
                                {...register("type", {
                                    required: "Tipo é obrigatório"
                                })}
                            >
                                <option value="">Selecione um tipo</option>
                                {Object.entries(ORDERS_TO_RECEIVE_TYPES).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                            {errors.type && <span style={{ color: 'red' }}>{errors.type.message}</span>}
                        </FormField>

                        <FormField>
                            <Label>
                                Data de Vencimento <span>*</span>
                            </Label>
                            <Input
                                type="date"
                                {...register("payment_due_date", {
                                    required: "Data de vencimento é obrigatória"
                                })}
                            />
                            {errors.payment_due_date && <span style={{ color: 'red' }}>{errors.payment_due_date.message}</span>}
                        </FormField>

                        <ButtonGroup>
                            <PrimaryButton type="submit" style={{ marginTop: 0 }}>
                                Criar Valor a Receber
                            </PrimaryButton>
                        </ButtonGroup>
                    </Form>
                )}
            </ModalContainer>
        </Modal>
    );
}
