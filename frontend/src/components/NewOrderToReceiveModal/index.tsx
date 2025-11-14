import { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useOrdersToReceive } from "../../contexts/OrdersToReceiveContext";
import { useOrders } from "../../contexts/OrdersContext";
import { IOrder } from "../../interfaces/IOrder";
import { IOrderToReceive } from "../../interfaces/IOrderToReceive";
import { ORDERS_TO_RECEIVE_TYPES } from "../../constants";
import {
    ModalContainer,
    Form,
    Input,
    InlineFormField,
    Label,
    EditFormField,
    ErrorMessage,
    Select 
} from '../../styles/global';
import { Loader } from "../Loader";
import { convertMoney } from "../../utils";
import moment from "moment";

interface NewOrderToReceiveModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    action: string;
    currentOrderToReceive: IOrderToReceive | null;
}

interface FormData {
    payment_due_date: string;
    type: string;
}

export function NewOrderToReceiveModal({ isOpen, onRequestClose, action, currentOrderToReceive }: NewOrderToReceiveModalProps) {
    const { createOrderToReceive, updateOrderToReceive, isLoading } = useOrdersToReceive();
    const { loadAvailableOrders } = useOrders();
    const [query, setQuery] = useState("");
    const [orderSuggestions, setOrderSuggestions] = useState<IOrder[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [orderError, setOrderError] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<FormData>();

    useEffect(() => {
        if (isOpen) {
            if (action === "edit" && currentOrderToReceive) {
                // Modo edição - preenche os campos
                setValue("payment_due_date", moment(currentOrderToReceive.payment_due_date).format('YYYY-MM-DD'));
                setValue("type", currentOrderToReceive.type);
                setSelectedOrder(currentOrderToReceive.order || null);
                setQuery("");
            } else {
                // Modo criação - limpa os campos
                setQuery("");
                setSelectedOrder(null);
                setValue("payment_due_date", "");
                setValue("type", "");
            }
            setOrderError("");
            setShowSuggestions(false);
            setOrderSuggestions([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, action, currentOrderToReceive]);

    const handleSearchOrders = (text: string) => {
        setQuery(text);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            if (text.length >= 2) {
                const availableOrders = await loadAvailableOrders(1, 50, text);
                setOrderSuggestions(availableOrders);
                setShowSuggestions(true);
            } else {
                setOrderSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);
    };

    const handleSelectOrder = (order: IOrder) => {
        setSelectedOrder(order);
        setQuery("");
        setShowSuggestions(false);
        setOrderError("");
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onSubmit = async (data: FormData) => {
        if (action === "create" && !selectedOrder) {
            setOrderError("Selecione um pedido");
            return;
        }

        try {
            if (action === "create") {
                await createOrderToReceive({
                    order_id: selectedOrder!.id!,
                    ...data
                });
            } else if (action === "edit" && currentOrderToReceive?.id) {
                await updateOrderToReceive(currentOrderToReceive.id, data);
            }
            
            reset();
            setQuery("");
            setSelectedOrder(null);
            onRequestClose();
        } catch (error) {
            console.error("Error saving order to receive:", error);
            alert("Erro ao salvar valor a receber. Tente novamente.");
        }
    };

    return (
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content"
            style={{
                content: {
                    maxWidth: '600px',
                    width: '90%'
                }
            }}
        >
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <Loader show={isLoading} />
            <ModalContainer>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <h2>{action === "create" ? "Adicionar" : "Editar"} Ordem a Receber</h2>

                    {action === "create" ? (
                        <div style={{ position: 'relative', width: '100%', marginBottom: '1.5rem' }}
                            ref={wrapperRef}>
                            <Label>Pedido *</Label>
                            <Input
                                type="text"
                                placeholder="Buscar por cliente ou código do pedido..."
                                value={query}
                                onChange={(e) => handleSearchOrders(e.target.value)}
                            />

                            {showSuggestions && orderSuggestions.length > 0 && query.length >= 2 && (
                                <ul className="suggestion-box">
                                    {orderSuggestions.map((order) => (
                                    <li key={order.id} onClick={() => handleSelectOrder(order)}>
                                        #{order.code} - {order.client?.first_name} {order.client?.last_name} - {convertMoney(order.total)}
                                    </li>
                                    ))}
                                </ul>
                            )}
                            {orderError && <ErrorMessage>{orderError}</ErrorMessage>}
                        </div>
                    ) : null}

                    {selectedOrder && (
                        <div style={{ 
                            padding: '1rem', 
                            backgroundColor: '#f3f4f6', 
                            borderRadius: '0.375rem',
                            marginBottom: '1.5rem'
                        }}>
                            <p><strong>Cliente:</strong> {selectedOrder.client?.first_name} {selectedOrder.client?.last_name}</p>
                            <p><strong>Total:</strong> {convertMoney(selectedOrder.total)}</p>
                            <p><strong>Data do pedido:</strong> {moment(selectedOrder.delivery_date).format('DD/MM/YYYY')}</p>
                        </div>
                    )}

                    <InlineFormField>
                        <EditFormField>
                            <Label>Data de Vencimento *</Label>
                            <Input
                                type="date"
                                {...register("payment_due_date", { required: "Data de vencimento é obrigatória" })}
                            />
                            {errors.payment_due_date && <ErrorMessage>{errors.payment_due_date.message}
                                </ErrorMessage>
                            }
                        </EditFormField>

                        <EditFormField>
                            <Label>Tipo *</Label>
                            <Select
                                isEditField
                                {...register("type", { required: "Tipo é obrigatório" })}
                            >
                                <option value="">Selecione o tipo</option>
                                {Object.entries(ORDERS_TO_RECEIVE_TYPES).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Select>
                            {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
                        </EditFormField>
                    </InlineFormField>

                    <button type="submit" disabled={isLoading} className="create-button">
                        {action === "create" ? "Adicionar" : "Salvar"}
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
