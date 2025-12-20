import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { listDeliveryMen } from "../../services/deliveryManService";
import { IOrder } from "../../interfaces/IOrder";
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
import { AddressContainer } from "./style";
import { Loader } from "../Loader";
import { convertMoney } from "../../utils";

interface SelectDeliveryManModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    order: IOrder | null;
    onConfirm: (deliveryManId: string, deliveryDate: string) => void;
    isLoading?: boolean;
}

interface FormData {
    delivery_man_id: string;
    delivery_date: string;
}

export function SelectDeliveryManModal({ isOpen, onRequestClose, order, onConfirm, isLoading = false }: SelectDeliveryManModalProps) {
    const [deliveryMen, setDeliveryMen] = useState<IDeliveryMan[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>();

    useEffect(() => {
        const fetchDeliveryMen = async () => {
            try {
                setLoading(true);
                const response = await listDeliveryMen(1, 100, "");
                setDeliveryMen(response.data.deliveryMen || []);
            } catch (error) {
                console.error("Error fetching delivery men:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchDeliveryMen();
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const onSubmit = async (data: FormData) => {
        onConfirm(data.delivery_man_id, data.delivery_date);
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

            <Loader show={loading || isLoading} />
            <ModalContainer>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Selecionar Motoboy para Entrega</h2>

                    {order && (
                        <AddressContainer>
                            <p><strong>Pedido:</strong> #{order.code}</p>
                            <p><strong>Cliente:</strong> {order.client?.first_name} {order.client?.last_name}</p>
                            <p><strong>Total:</strong> {convertMoney(order.total)}</p>
                            <p><strong>Taxa de entrega:</strong> {convertMoney(order.delivery_fee || 0)}</p>
                            {order.clientAddress && (
                                <p><strong>Endereço:</strong> {order.clientAddress.street}, {order.clientAddress.street_number} - {order.clientAddress.neighborhood}, {order.clientAddress.city}</p>
                            )}
                        </AddressContainer>
                    )}

                    <InlineFormField>
                        <EditFormField>
                            <Label>Motoboy</Label>
                            <Select
                                isEditField
                                {...register("delivery_man_id", { required: "Selecione o motoboy" })}
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
                        Confirmar e Finalizar Pedido
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    );
}
