import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "react-modal";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getDeliveryManByPhoneCode } from "../../services/deliveryManService";
import { getCompletedOrder, updateStatus } from "../../services/orderService";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { convertMoney, formatTelephone } from "../../utils";
import { Loader } from "../../components/Loader";
import { ErrorAlert } from "../../components/ErrorAlert";
import { IOrder } from "../../interfaces/IOrder";
import { IDeliveryMan } from "../../interfaces/IDeliveryMan";
import {
    Container,
    Form,
    FormHeader,
    FormFieldsContainer,
    FormField,
    Label,
    Input,
    CompletedDelivery,
    DeliveryManInfo,
    SubmitButton
} from "./style";
import { ErrorMessage } from "../../styles/global";

interface IDeliveryForm {
    phone_code: string;
    delivery_date: string;
}

export function CompleteDelivery() {
    const [storeLogo, setStoreLogo] = useState("");
    const [storeName, setStoreName] = useState("");
    const [storeCNPJ, setStoreCNPJ] = useState("");
    const [storePhone, setStorePhone] = useState("");
    const { id: orderId } = useParams<{ id: string }>();
    const { createOrderDelivery } = useOrderDeliveries();
    const [showLoader, setShowLoader] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [deliveryMan, setDeliveryMan] = useState<IDeliveryMan | null>(null);
    const [order, setOrder] = useState<IOrder | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showNoDeliveryManModal, setShowNoDeliveryManModal] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<IDeliveryForm>({
        defaultValues: {
            delivery_date: moment().format('YYYY-MM-DDTHH:mm')
        }
    });

    const phone_code = watch("phone_code");

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!orderId) {
                setErrorMessage("ID do pedido inválido");
                setShowLoader(false);
                return;
            }

            try {
                const { data: orderData } = await getCompletedOrder(orderId);
                setOrder(orderData);
                setStoreLogo(orderData.store.logo || "");
                setStoreName(orderData.store.name || "");
                setStoreCNPJ(orderData.store.cnpj || "");
                setStorePhone(orderData.store.phone_number || "");
            } catch (error) {
                console.error("Error fetching order:", error);
                setErrorMessage("Erro ao carregar pedido");
            } finally {
                setShowLoader(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    useEffect(() => {
        const fetchDeliveryManData = async () => {
            const code = phone_code?.replace(/\D/g, '');

            if (code && code.length === 4) {
                try {
                    setShowLoader(true);
                    const response = await getDeliveryManByPhoneCode(code);
                    const { data: deliveryManData } = response;

                    if (deliveryManData) {
                        setDeliveryMan(deliveryManData);
                        setShowNoDeliveryManModal(false);
                    } else {
                        setDeliveryMan(null);
                        setShowNoDeliveryManModal(true);
                    }
                    setShowLoader(false);
                } catch (error) {
                    setDeliveryMan(null);
                    setShowNoDeliveryManModal(true);
                    setShowLoader(false);
                }
            }
        };

        const timeout = setTimeout(() => {
            fetchDeliveryManData();
        }, 600);

        return () => clearTimeout(timeout);
    }, [phone_code]);

    const onSubmit = async (data: IDeliveryForm) => {
        if (!deliveryMan) {
            setErrorMessage("Motoboy não encontrado");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        if (!orderId) {
            setErrorMessage("ID do pedido inválido");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setShowLoader(true);

        try {
            await createOrderDelivery({
                order_id: orderId,
                delivery_man_id: deliveryMan.id!,
                delivery_date: moment(data.delivery_date).toISOString(),
                store_id: order!.store_id
            });

            await updateStatus({
                id: orderId,
                status: 'DONE'
            });

            setIsCompleted(true);
            setErrorMessage("");
            
        } catch (error: any) {
            console.error("Error creating delivery:", error);
            setErrorMessage("Erro ao registrar entrega. Tente novamente.");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <Container>
            <Loader show={showLoader} />
            {errorMessage && <ErrorAlert message={errorMessage} />}

            <Modal
                isOpen={showNoDeliveryManModal}
                onRequestClose={() => setShowNoDeliveryManModal(false)}
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
            >
                <button
                    type="button"
                    onClick={() => setShowNoDeliveryManModal(false)}
                    className="modal-close"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '15px', color: '#e74c3c' }}>Motoboy não encontrado</h2>
                    <p style={{ fontSize: '16px', color: '#666' }}>
                        Nenhum motoboy foi encontrado com o código informado.
                    </p>
                    <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                        Verifique o código e tente novamente.
                    </p>
                </div>
            </Modal>

            {(isCompleted || order?.status === 'DONE') ? (
                <CompletedDelivery>
                    <img src={storeLogo} alt="" />
                    <h1>Entrega confirmada com sucesso!</h1>
                    <p>🚚📦✅</p>
                </CompletedDelivery>
            ) : (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader>
                        <img src={storeLogo} alt="" />
                        <p>{storeName}</p>
                        <span>CNPJ: {storeCNPJ}</span>
                        <span>Tel: {storePhone}</span>
                    </FormHeader>

                    <div className="spacer"></div>
                    <h1 className="client-container-title">Concluir Entrega</h1>

                    {order && (
                        <div className="order-info">
                            <p><strong>Pedido: </strong> #{order.code}</p>
                            <p><strong>Taxa de Entrega: </strong> {convertMoney(order.delivery_fee)}</p>
                            <p><strong>Recebedor: </strong> 
                                {order.receiver_name!== "" ? order.receiver_name : order.client?.first_name}
                            </p>
                        </div>
                    )}

                    <FormFieldsContainer>
                        {deliveryMan && (
                            <DeliveryManInfo>
                                <div className="avatar">
                                    {deliveryMan.name
                                        .split(" ")
                                        .map(word => word[0])
                                        .join("")
                                    }
                                </div>

                                <div className="info">
                                    <h4>Motoboy Identificado</h4>
                                    <p><strong>{deliveryMan.name} ✔️</strong></p>
                                    <p>Telefone: {formatTelephone(deliveryMan.phone_number)}</p>
                                </div>
                            </DeliveryManInfo>
                        )}

                        <FormField>
                            <Label>
                                Código do Motoboy
                                <span>*</span>
                            </Label>
                            <Input
                                autoComplete="off"
                                type="text"
                                placeholder='Digite o código de 4 dígitos'
                                maxLength={4}
                                {...register("phone_code", {
                                    required: "Código é obrigatório",
                                    validate: (value) => {
                                        const code = value.replace(/\D/g, '');
                                        if (code.length !== 4) {
                                            return "Código deve ter 4 dígitos";
                                        }
                                        return true;
                                    }
                                })}
                            />
                            {errors.phone_code && <ErrorMessage>{errors.phone_code.message}</ErrorMessage>}
                        </FormField>

                        <FormField>
                            <Label>
                                Data e Hora da Entrega
                                <span>*</span>
                            </Label>
                            <Input
                                type="datetime-local"
                                {...register("delivery_date", {
                                    required: "Data de entrega é obrigatória"
                                })}
                            />
                            {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                        </FormField>

                        <SubmitButton type="submit" disabled={!deliveryMan}>
                            Confirmar Entrega
                        </SubmitButton>
                    </FormFieldsContainer>
                </Form>
            )}
        </Container>
    );
}
