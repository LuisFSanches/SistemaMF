import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Modal from "react-modal";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import transparentLogo from '../../assets/images/transparent_logo.png'
import { getDeliveryManByPhoneNumber } from "../../services/deliveryManService";
import { getOrder, updateStatus } from "../../services/orderService";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { rawTelephone, convertMoney, formatTelephone } from "../../utils";
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
    phone_number: string;
    delivery_date: string;
}

export function CompleteDelivery() {
    const { id: orderId } = useParams<{ id: string }>();
    const { createOrderDelivery } = useOrderDeliveries();
    const [showLoader, setShowLoader] = useState(true);
    const [mask, setMask] = useState("(99) 99999-9999");
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

    const phone_number = watch("phone_number");

    useEffect(() => {
        const fetchOrderData = async () => {
            if (!orderId) {
                setErrorMessage("ID do pedido inválido");
                setShowLoader(false);
                return;
            }

            try {
                const { data: orderData } = await getOrder(orderId);
                setOrder(orderData);
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
            const phoneNumber = rawTelephone(phone_number);

            if (phoneNumber && phoneNumber.length >= 10) {
                try {
                    setShowLoader(true);
                    const response = await getDeliveryManByPhoneNumber(phoneNumber);
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
    }, [phone_number]);

    useEffect(() => {
        const phoneNumber = watch("phone_number") || "";
        const numericValue = rawTelephone(phoneNumber);

        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setMask("(99) 9999-9999");
            } else {
                setMask("(99) 99999-9999");
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [phone_number, watch]);

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
                delivery_date: moment(data.delivery_date).toISOString()
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
                        Nenhum motoboy foi encontrado com o telefone informado.
                    </p>
                    <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
                        Verifique o número e tente novamente.
                    </p>
                </div>
            </Modal>

            {(isCompleted || order?.status === 'DONE') ? (
                <CompletedDelivery>
                    <img src={transparentLogo} alt="" />
                    <h1>Entrega confirmada com sucesso!</h1>
                    <p>🚚📦✅</p>
                </CompletedDelivery>
            ) : (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormHeader>
                        <img src={transparentLogo} alt="" />
                        <p>Mirai Flores</p>
                        <span>CNPJ: 33.861.078/0001-50</span>
                        <span>Tel: (22) 99751-7940</span>
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
                                Telefone do Motoboy
                                <span>*</span>
                            </Label>
                            <InputMask
                                autoComplete="off"
                                mask={mask}
                                alwaysShowMask={false}
                                placeholder='Telefone'
                                value={watch("phone_number") || ""}
                                {...register("phone_number", {
                                    required: "Telefone inválido",
                                    validate: (value) => {
                                        if (value.replace(/[^0-9]/g, "").length < 10) {
                                            return "Telefone inválido";
                                        }
                                        return true;
                                    }
                                })}
                            />
                            {errors.phone_number && <ErrorMessage>{errors.phone_number.message}</ErrorMessage>}
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
