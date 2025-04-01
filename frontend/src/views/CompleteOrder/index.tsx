import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { IOrder } from "../../interfaces/IOrder";
import { getClientByPhone } from "../../services/clientService";
import { getClientAddresses } from "../../services/addressService";
import { getPickupAddress } from "../../services/addressService";
import { finishOnlineOrder } from "../../services/orderService";
import { getOrder } from "../../services/orderService";
import { useOrders } from "../../contexts/OrdersContext";
import { Loader } from '../../components/Loader';
import { WelcomeBackModal } from "../../components/WelcomeBackModal";
import { ErrorAlert } from "../../components/ErrorAlert";
import logoFull from '../../assets/images/logo.png'
import { convertMoney } from "../../utils";
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
    PrimaryButton,
} from "../../styles/global";
import { TYPES_OF_DELIVERY, STATES, PAYMENT_METHODS } from "../../constants";
import { rawTelephone } from "../../utils";

import { Form, Container, FormHeader, CompletedOrder, OrderReview } from "./style";

interface INewOrder {
    first_name: string;
    last_name: string;
    phone_number: string;
    addressId: string;
    pickup_on_store: boolean;
    type_of_delivery: string;
    postal_code: string;
    city: string;
    state: string;
    street: string;
    street_number: string;
    complement: string;
    reference_point: string;
    neighborhood: string;
    country: string;
    receiver_name: string;
    receiver_phone: string;
    delivery_date: string;
    has_card: boolean;
    card_message: string;
    card_from: string;
    card_to: string;
    payment_method: string;
}

export function CompleteOrder() {
    const { addOrder } = useOrders();
    const [showLoader, setShowLoader] = useState(true);
    const [mask, setMask] = useState("(99) 99999-9999");
    const [receiverMask, setReceiverMask] = useState("(99) 99999-9999");
    const [addresses, setAddresses] = useState([]);
    const [client_id, setClientId] = useState("");
    const [addressId, setAddressId] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [pickupOnStore, setPickupOnStore] = useState(false);
    const [newAddress, setNewAddress] = useState(false);
    const [isWaitingForClienteOrder, setIsWaitingForClienteOrder] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);

    const url = window.location.href;
    const urlParts = url.split('/');
    const orderId = urlParts[urlParts.length - 1];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<INewOrder>({
        defaultValues: {
            country: "Brasil",
            state: "RJ",
            city: "Itaperuna",
            postal_code: "28300-000",
        }
    });

    const submitOrder = async (data: INewOrder) => {
        setShowLoader(true);
        const orderData = {
            id: orderId,
            client_id: client_id,
            phone_number: rawTelephone(phone_number),
            first_name: data.first_name,
            last_name: data.last_name,
            pickup_on_store: data.pickup_on_store,
            address_id: addressId,
            type_of_delivery: data.type_of_delivery,
            clientAddress: {
                id: data.addressId,
                phone_number: data.phone_number,
                pickup_on_store: data.pickup_on_store,
                postal_code: data.postal_code,
                city: data.city,
                state: data.state,
                street: data.street,
                street_number: data.street_number,
                complement: data.complement,
                reference_point: data.reference_point,
                neighborhood: data.neighborhood,
                country: data.country,
            },
            receiver_name: data.receiver_name,
            receiver_phone: data.receiver_phone,
            delivery_date: data.delivery_date,
            payment_method: data.payment_method,
            has_card: data.has_card,
            card_message: data.card_message,
            card_from: data.card_from,
            card_to: data.card_to,
            status: 'OPENED',
            editAddress: true,
        }

        try {
            const { data: response } = await finishOnlineOrder(orderData);
            addOrder(response);
            if (response.order.id) {
                setIsWaitingForClienteOrder(false);
            }
            setErrorMessage('');
        }
        catch (error: any) {
            const response = error.response.data
            if (response.code === 401 && response.message === "Invalid order code") {
                setErrorMessage('Código de pedido inválido');
                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }
        }

        setShowLoader(false);
    }

    const phone_number = watch("phone_number");
    const typeOfDelivery = watch("type_of_delivery");
    const hasCard = watch("has_card");
    const watchReceiverPhone = watch("receiver_phone");
    const watchPhoneNumber = watch("phone_number");

    useEffect(() => {
        const fetchOrderData = async () => {
            const { data: order } = await getOrder(orderId);
            if (order.status === "WAITING_FOR_CLIENT") {
                setIsWaitingForClienteOrder(true);
                setCurrentOrder(order);
            }
            setShowLoader(false);
        }

        fetchOrderData();
    }, [orderId]);

    useEffect(() => {
        const fetchClientData = async () => {
            const phoneNumber = rawTelephone(phone_number);

            if (phoneNumber && phoneNumber.length >= 10) {
                    setShowLoader(true);
                    const response = await getClientByPhone(phoneNumber);
                    const { data: client } = response;

                    if (!client) {
                        setClientId("");
                        setShowLoader(false);
                    }

                    if (client) {
                        setValue("first_name", client.first_name);
                        setValue("last_name", client.last_name);
                        setClientId(client.id);
                        const { data: addresses } = await getClientAddresses(client.id);
                    
                        if (addresses) {
                            setAddresses(addresses);
                        }
                        setShowLoader(false);
                        setShowWelcomeModal(true);
                }
            }
        };
        
        fetchClientData();
    }, [phone_number, setValue, setError]);

    useEffect(() => {
        const phoneNumber = watch("receiver_phone") || "";
        const numericValue = rawTelephone(phoneNumber);
    
        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setReceiverMask("(99) 9999-9999");
            } else {
                setReceiverMask("(99) 99999-9999");
            }
        }, 800);

        return () => clearTimeout(timeout);
    }, [watchReceiverPhone, watch, setReceiverMask]);

        useEffect(() => {
            const phoneNumber = watch("phone_number") || "";
            const numericValue = rawTelephone(phoneNumber);
        
            const timeout = setTimeout(() => {
                if (numericValue.length === 10) {
                    setMask("(99) 9999-9999");
                } else {
                    setMask("(99) 99999-9999");
                }
            }, 800);
    
            return () => clearTimeout(timeout);
        }, [watchPhoneNumber, watch, setMask]);

    const handlePickUpAddress = async (value: boolean) => {
        if (value) {
            const { data: pickUpAddress } = await getPickupAddress() as any;
            setAddressId(pickUpAddress.id);
            setValue("addressId", pickUpAddress.id);
            setValue("pickup_on_store", true);
        }

        if (!value) {
            setValue("addressId", "");
            setValue("pickup_on_store", false);
        }
    }

    return (
        <Container>
            <WelcomeBackModal
                isOpen={showWelcomeModal}
                onRequestClose={() => setShowWelcomeModal(false)}
                name={`${watch("first_name")} ${watch("last_name")}`}
            />
            <Loader show={showLoader} />
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {(!isWaitingForClienteOrder && !showLoader ) &&
                <CompletedOrder>
                    <img src={logoFull} alt="" />
                    <h1>Seu pedido foi enviado para a loja!</h1>
                    <h2>Qualquer dúvida entre em contato conosco.</h2>
                </CompletedOrder>
            }
            {isWaitingForClienteOrder &&
                <Form onSubmit={handleSubmit(submitOrder)}>
                    <FormHeader>
                        <img src={logoFull} alt="" />
                    </FormHeader>
                    <OrderReview>
                        <h1>Resumo do pedido</h1>
                        <div>
                            <p><strong>Descrição: </strong> {currentOrder?.description}</p>
                            <p><strong>Observação:</strong> {currentOrder?.additional_information}</p>
                            <p><strong>Valor dos Produtos: </strong> {
                                currentOrder?.products_value  &&
                                convertMoney(currentOrder?.products_value as number)
                            }</p>
                            <p><strong>Taxa de entrega: </strong> {
                                currentOrder?.delivery_fee &&
                                convertMoney(currentOrder?.delivery_fee as number)
                            }</p>
                            <p><strong>Valor Total: </strong> {
                                currentOrder?.total &&
                                convertMoney(currentOrder?.total as number)
                            }</p>
                        </div>
                    </OrderReview>
                    <FormField>
                        <Label>
                            Seu telefone
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
                    <InlineFormField>
                        <FormField>
                            <Label>
                                Seu nome
                                <span>*</span>
                            </Label>
                            <Input type="text" autoComplete="off" placeholder="Digite seu nome"
                                {...register("first_name", {
                                    required: "Nome inválido",
                                })}
                            />
                            {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}
                        </FormField>
                        <FormField>
                            <Label>
                                Seu sobrenome
                                <span>*</span>
                            </Label>
                            <Input type="text" placeholder="Digite seu sobrenome" 
                                {...register("last_name", {
                                    required: "Sobrenome inválido",
                                })}
                            />
                            {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                        </FormField>
                    </InlineFormField>
                    <FormField>
                        <Label>
                            Informe sobre a entrega
                            <span>*</span>
                        </Label>
                        <Select {...register("type_of_delivery", { required: "Administrador Responsável inválido" })}>
                            <option value="">Escolher:</option>
                            {Object.entries(TYPES_OF_DELIVERY).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </Select>
                        {errors.type_of_delivery && <ErrorMessage>{errors.type_of_delivery.message}</ErrorMessage>}
                    </FormField>
                    {typeOfDelivery === "SOMEONES_GIFT" &&
                        <InlineFormField>
                            <FormField>
                                <Label>
                                    Recebedor
                                    <span>*</span>
                                </Label>
                                <Input type="text" placeholder="Recebedor"
                                    {...register("receiver_name", {
                                        required: "Nome inválido",
                                    })}
                                />
                                {errors.receiver_name && <ErrorMessage>{errors.receiver_name.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>
                                    Telefone do recebedor
                                    <span>*</span>
                                </Label>
                                <InputMask
                                    autoComplete="off"
                                    mask={receiverMask}
                                    alwaysShowMask={false}
                                    placeholder='Telefone'
                                    value={watch("receiver_phone") || ""}
                                    {...register("receiver_phone", { 
                                    })}
                                />
                                {errors.receiver_phone && <ErrorMessage>{errors.receiver_phone.message}</ErrorMessage>}
                            </FormField>
                        </InlineFormField>
                    }
                    {addresses.length === 0 &&
                        <CheckboxContainer alignLeft>
                            <Checkbox type="checkbox" onChange={(e) => {
                                setPickupOnStore(!pickupOnStore)
                                handlePickUpAddress(e.target.checked);
                                
                            }} checked={pickupOnStore}/>
                            <Label>Retirar Pedido na loja</Label>
                        </CheckboxContainer>
                    }
                    {addresses.length > 0 && (
                        <>
                            {!pickupOnStore &&
                                <FormField>
                                    <Label>
                                        Selecione o Endereço (Ou cadastre um novo)
                                        <span>*</span>
                                    </Label>
                                    <Select
                                        {...register("addressId")}
                                        onChange={(e) => {
                                            const selectedAddressId = e.target.value;
                                            const selectedAddress: any = addresses.find((address: any) => address.id === selectedAddressId);
                                            setSelectedAddress(selectedAddress);
                                            if (selectedAddress) {
                                                setValue("postal_code", selectedAddress.postal_code);
                                                setValue("street", selectedAddress.street);
                                                setValue("street_number", selectedAddress.street_number);
                                                setValue("city", selectedAddress.city);
                                                setValue("neighborhood", selectedAddress.neighborhood);
                                                setValue("complement", selectedAddress.complement);
                                                setValue("reference_point", selectedAddress.reference_point);
                                                setValue("state", selectedAddress.state);
                                                setValue("country", selectedAddress.country);
                                                setAddressId(selectedAddressId);
                                            }

                                            if (!selectedAddress) {
                                                setValue("postal_code", "");
                                                setValue("street", "");
                                                setValue("street_number", "");
                                                setValue("city", "");
                                                setValue("neighborhood", "");
                                                setValue("complement", "");
                                                setValue("reference_point", "");
                                                setValue("state", "");
                                                setValue("country", "");
                                                setAddressId("");
                                            }
                                        }}
                                    >
                                        <option value="">Selecione um endereço</option>
                                        {addresses.map((address: any) => (
                                            <option key={address.id} value={address.id}>
                                                {address.street}, {address.number} - {address.city}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>
                            }
                            
                            <InlineFormField>
                                <CheckboxContainer>
                                    <Checkbox type="checkbox" disabled={pickupOnStore} onChange={() => {
                                        setNewAddress(!newAddress)

                                        if (!newAddress) {
                                            setAddressId("");
                                            setValue("addressId", "");
                                        }

                                        if (newAddress) {
                                            setAddressId(selectedAddress.id);
                                            setValue("addressId", selectedAddress.id);
                                        }
                                        
                                    }} checked={newAddress}/>
                                    <Label>Cadastrar novo endereço</Label>
                                </CheckboxContainer>

                                <CheckboxContainer>
                                    <Checkbox type="checkbox" onChange={(e) => {
                                        setPickupOnStore(!pickupOnStore)
                                        handlePickUpAddress(e.target.checked);
                                        
                                    }} checked={pickupOnStore}/>
                                    <Label>Retirar na Loja</Label>
                                </CheckboxContainer>
                            </InlineFormField>
                        </>
                    )}
                    {!pickupOnStore &&
                        <>
                            <FormField>
                                <Label>
                                    Rua
                                    <span>*</span>
                                </Label>
                                <Input type="text" placeholder="Rua" {...register("street", {
                                    required: "Rua inválida",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.street && <ErrorMessage>{errors.street.message}</ErrorMessage>}
                            </FormField>
                            <InlineFormField>
                                <FormField isShortField>
                                    <Label>
                                        Número
                                        <span>*</span>
                                    </Label>
                                    <Input type="text" placeholder="Número" {...register("street_number", {
                                        required: "Número inválido",
                                        })}
                                        disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                    />
                                    {errors.street_number && <ErrorMessage>{errors.street_number.message}</ErrorMessage>}
                                </FormField>
                                <FormField>
                                    <Label>
                                        Complemento
                                        <span>*</span>
                                    </Label>
                                    <Input type="text" placeholder="Complemento" {...register("complement")}
                                        disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                    />
                                </FormField>
                            </InlineFormField>
                            <FormField>
                                <Label>
                                    Bairro
                                    <span>*</span>
                                </Label>
                                <Input type="text" placeholder="Bairro" {...register("neighborhood", {
                                    required: "Bairro inválido",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.neighborhood && <ErrorMessage>{errors.neighborhood.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Ponto de referência</Label>
                                <Input type="text" placeholder="Ponto de referência" {...register("reference_point")}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                            </FormField>

                            <InlineFormField>
                                <FormField>
                                    <Label>
                                        Estado
                                        <span>*</span>
                                    </Label>
                                    <Select {...register("state", {
                                        required: "Estado inválido",
                                        })}>
                                        <option value="">Selecionar</option>
                                        {Object.entries(STATES).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </Select>
                                    {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
                                </FormField>
                                <FormField>
                                    <Label>
                                        Cidade
                                        <span>*</span>
                                    </Label>
                                    <Input type="text" placeholder="Cidade" {...register("city", {
                                        required: "Cidade inválido",
                                        })}
                                        disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                    />
                                    {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
                                </FormField>
                            </InlineFormField>
                        </>
                    }
                    <FormField>
                        <Label>
                            Data de Entrega
                            <span>*</span>
                        </Label>
                        <Input type="date" {...register("delivery_date", {
                            required: "Data de entrega é obrigatória",
                        })}/>
                        {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                    </FormField>
                    <FormField>
                        <Label>Método de pagamento</Label>
                        <Select {...register("payment_method", {required: "Método de pagamento é obrigatório",})}>
                            <option value="">Selecionar </option>
                            {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </Select>
                        {errors.payment_method && <ErrorMessage>{errors.payment_method.message}</ErrorMessage>}
                    </FormField> 
                    <FormField>
                        <CheckboxContainer>
                            <Checkbox type="checkbox" {...register("has_card")} />
                            <Label>Pedido Contém Cartão.</Label>
                        </CheckboxContainer>
                    </FormField>
                    {hasCard &&
                        <>
                            <FormField>
                                <Label>
                                    De: <span>*</span>
                                </Label>
                                <Input {...register("card_from", {
                                    required: "Remetente do cartão é obrigatório",
                                })}/>
                                {errors.card_from && <ErrorMessage>{errors.card_from.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>
                                    Para: <span>*</span>
                                </Label>
                                <Input {...register("card_to", {
                                    required: "Destinatário do cartão é obrigatório",
                                })}/>
                                {errors.card_to && <ErrorMessage>{errors.card_to.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Mensagem do cartão <span>*</span></Label>
                                <Textarea {...register("card_message", {required: "Mensagem do cartão é obrigatório",})}
                                />
                                {errors.card_message && <ErrorMessage>{errors.card_message.message}</ErrorMessage>}
                            </FormField>
                        </>
                    }
                    
                    <PrimaryButton type="submit">Finalizar Pedido</PrimaryButton>
                </Form>
            }
        </Container>
    );
}
