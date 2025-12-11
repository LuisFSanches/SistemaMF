import { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { useOrders } from "../../contexts/OrdersContext";
import { listDeliveryMen } from "../../services/deliveryManService";
import { updateStatus } from "../../services/orderService";
import { IOrder } from "../../interfaces/IOrder";
import { IOrderDelivery } from "../../interfaces/IOrderDelivery";
import { IDeliveryMan } from "../../interfaces/IDeliveryMan";
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

interface NewOrderDeliveryModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    action: string;
    currentOrderDelivery: IOrderDelivery | null;
}

interface FormData {
    delivery_date: string;
    delivery_man_id: string;
}

export function NewOrderDeliveryModal({ isOpen, onRequestClose, action, currentOrderDelivery }: NewOrderDeliveryModalProps) {
    const { createOrderDelivery, updateOrderDelivery, isLoading } = useOrderDeliveries();
    const { loadAvailableOrders, loadOnGoingOrders } = useOrders();
    const [query, setQuery] = useState("");
    const [orderSuggestions, setOrderSuggestions] = useState<IOrder[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
    const [deliveryMen, setDeliveryMen] = useState<IDeliveryMan[]>([]);
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
        const fetchDeliveryMen = async () => {
            try {
                const response = await listDeliveryMen(1, 100, "");
                setDeliveryMen(response.data.deliveryMen || []);
            } catch (error) {
                console.error("Error fetching delivery men:", error);
            }
        };

        if (isOpen) {
            fetchDeliveryMen();
            
            if (action === "edit" && currentOrderDelivery) {
                // Modo edição - preenche os campos
                setValue("delivery_date", moment(currentOrderDelivery.delivery_date).format('YYYY-MM-DDTHH:mm'));
                setValue("delivery_man_id", currentOrderDelivery.delivery_man_id);
                setSelectedOrder(currentOrderDelivery.order || null);
                setQuery("");
            } else {
                // Modo criação - limpa os campos
                setQuery("");
                setSelectedOrder(null);
                setValue("delivery_date", "");
                setValue("delivery_man_id", "");
            }
            setOrderError("");
            setShowSuggestions(false);
            setOrderSuggestions([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, action, currentOrderDelivery]);

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
                await createOrderDelivery({
                    order_id: selectedOrder!.id!,
                    ...data
                });

                await updateStatus({
                    id: selectedOrder!.id!,
                    status: 'DONE'
                });

                await loadOnGoingOrders(true);
            } else if (action === "edit" && currentOrderDelivery?.id) {
                await updateOrderDelivery(currentOrderDelivery.id, data);
            }
            
            reset();
            setQuery("");
            setSelectedOrder(null);
            onRequestClose();
        } catch (error) {
            console.error("Error saving order delivery:", error);
            alert("Erro ao salvar entrega. Tente novamente.");
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
                    <h2>{action === "create" ? "Adicionar" : "Editar"} Entrega de Pedido</h2>

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
                            <p><strong>Taxa de entrega:</strong> {convertMoney(selectedOrder.delivery_fee || 0)}</p>
                            <p><strong>Data do pedido:</strong> {moment(selectedOrder.delivery_date).format('DD/MM/YYYY')}</p>
                        </div>
                    )}

                    <InlineFormField>
                        <EditFormField>
                            <Label>Motoboy *</Label>
                            <Select
                                isEditField
                                {...register("delivery_man_id", { required: "Motoboy é obrigatório" })}
                            >
                                <option value="">Selecione o motoboy</option>
                                {deliveryMen.map((deliveryMan) => (
                                    <option key={deliveryMan.id} value={deliveryMan.id}>
                                        {deliveryMan.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.delivery_man_id && <ErrorMessage>{errors.delivery_man_id.message}</ErrorMessage>}
                        </EditFormField>

                        <EditFormField>
                            <Label>Data de Entrega *</Label>
                            <Input
                                type="datetime-local"
                                {...register("delivery_date", { required: "Data de entrega é obrigatória" })}
                            />
                            {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
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
