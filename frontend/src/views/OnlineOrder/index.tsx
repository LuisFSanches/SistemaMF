import { useState } from "react";
import moment from "moment";
import { useForm } from "react-hook-form";
import { PAYMENT_METHODS } from "../../constants";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { createOrder } from "../../services/orderService";
import { useAdmins } from "../../contexts/AdminsContext";
import { useOrders } from "../../contexts/OrdersContext";
import { Loader } from '../../components/Loader';
import {
    FormField,
    Label,
    Input,
    Select,
    Textarea,
    InlineFormField,
    CheckboxContainer,
    Checkbox,
    ErrorMessage,
    PrimaryButton
} from "../../styles/global";

import { Form, Container, FormHeader, OrderDetail } from "./style";

interface INewOrder {
    id: string;
    description: string;
    additional_information: string;
    has_card: boolean;
    payment_received: boolean;
    delivery_date: string;
    payment_method: string;
    products_value: number;
    delivery_fee: number;
    total: number;
    created_by: string;
    online_code: string
}

export function OnlineOrder() {
    const { admins } = useAdmins();
    const { addOrder } = useOrders();
    const [showLoader, setShowLoader] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [orderLink, setOrderLink] = useState("");
    const [orderCode, setOrderCode] = useState("");
    const mockedDeliveryDate = moment().add(2, "days").format("YYYY-MM-DD");
    const mockedPaymentMethod = Object.entries(PAYMENT_METHODS)[0][0];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<INewOrder>();

    function generateOnlineCode() {
        const numerosAleatorios = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
        const timestamp = Date.now().toString().slice(0, 3);
        return `${numerosAleatorios}${timestamp}`;
    }

    const submitOrder = async (data: INewOrder) => {
        const baseUrl = process.env.REACT_APP_URL;

        setShowLoader(true);
        const orderData = {
            client_id: null,
            phone_number: "",
            first_name: "",
            last_name: "",
            receiver_name: "",
            receiver_phone: "",
            addressId: "",
            pickup_on_store: false,
            street: "",
            street_number: "",
            complement: "",
            reference_point: "",
            neighborhood: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
            description: data.description,
            additional_information: data.additional_information,
            delivery_date: mockedDeliveryDate,
            payment_method: mockedPaymentMethod,
            payment_received: data.payment_received,
            products_value: Number(data.products_value),
            delivery_fee: Number(data.delivery_fee),
            total: Number(data.products_value) + Number(data.delivery_fee),
            status: "WAITING_FOR_CLIENT",
            has_card: false,
            created_by: data.created_by,
            online_order: true,
            online_code: generateOnlineCode()
        }
        const { data: response } = await createOrder(orderData);
        if (response.order.id) {
            setShowOrderDetail(true);
            setOrderLink(`${baseUrl}completarPedido/${response.order.id}`);
            setOrderCode(response.order.online_code);
        }

        addOrder(response);

        setShowLoader(false);
    }

    return (
        <Container>
            {showOrderDetail &&
                <OrderDetail>
                    <div className="order-detail-container">
                        <h2>Pedido criado com sucesso</h2>
                        <p>
                            Passe para o cliente os dados abaixo, para que ele possa completar as informações
                            no formulário:
                        </p>
                        <div>
                            <p>
                                <strong>Link do pedido: </strong>
                                {orderLink}
                            </p>
                            <p><strong>Código do pedido:</strong> {orderCode}</p>
                        </div>
                        <span className="instruction-message">
                            Obs: O código do pedido deverá ser inserido pelo cliente no formulário
                        </span>
                    </div>
                </OrderDetail>
            }
            <Loader show={showLoader} />
            {!showOrderDetail &&
                <Form onSubmit={handleSubmit(submitOrder)}>
                    <FormHeader>
                        <FontAwesomeIcon icon={faWhatsapp as any} size="3x"/>
                        <h2>Novo Pedido</h2>
                    </FormHeader>
                    <FormField>
                        <Label>Descrição do Pedido</Label>
                        <Textarea placeholder=" 1x Bouquet de rosas
                        1x cartao
                        1x caixa de bombom" {...register("description", {
                            required: "Descrição do pedido é obrigatória",
                        })}
                        />
                        {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
                    </FormField>
                    <FormField>
                        <Label>Observações</Label>
                        <Textarea placeholder="Observações" {...register("additional_information")}
                        />
                    </FormField>
                    <InlineFormField>
                        <FormField>
                            <CheckboxContainer>
                                <Checkbox type="checkbox" {...register("payment_received")} />
                                <Label>Pagamento Recebido</Label>
                            </CheckboxContainer>
                        </FormField>
                        <FormField>
                            <Label>Administrador Responsável</Label>
                            <Select {...register("created_by", { required: "Administrador Responsável inválido" })}>
                                <option value="">Selecione um Administrador</option>
                                {admins.map((admin: any) => (
                                    <option key={admin.id} value={admin.id}>{admin.name}</option>
                                ))}
                            </Select>
                            {errors.created_by && <ErrorMessage>{errors.created_by.message}</ErrorMessage>}
                        </FormField>
                    </InlineFormField>
                    <InlineFormField>
                        <FormField>
                            <Label>Valor total dos Produtos</Label>
                            <Input type="number" step="0.01" placeholder="Total" {...register("products_value", {
                                required: "Valor total é obrigatório",
                            })} />
                            {errors.products_value && <ErrorMessage>{errors.products_value.message}</ErrorMessage>}
                        </FormField>
                        <FormField>
                            <Label>Taxa de entrega</Label>
                            <Input type="number" step="0.01" placeholder="0.00" {...register("delivery_fee", {
                            })} />
                        </FormField>
                    </InlineFormField>
                    <PrimaryButton type="submit">Finalizar Pedido</PrimaryButton>
                </Form>
            }

        </Container>
    );
}
