import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faPrint, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import {
    Container,
    FormHeader,
    Form,
    InlineFormField,
    StepButton,
    ActionButtons,
    ErrorMessage,
    CheckboxContainer,
    Checkbox,
    OrderSummary
} from "./style";

import {
    FormField,
    Label,
    Input,
    Select,
    Textarea,
} from "../../styles/global";

import { NewOrderProgressBar } from "../../components/NewOrderProgressBar";
import { getClientByPhone } from "../../services/clientService";
import { getClientAddresses } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import { rawTelephone } from "../../utils";
import { PAYMENT_METHODS } from "../../constants";

interface INewOrder {
    phone_number: string;
    first_name: string;
    last_name: string;
    receiver_name: string;
    receiver_phone: string;
    addressId: string;
    street: string;
    street_number: string;
    complement: string;
    reference_point: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    description: string;
    additional_information: string;
    delivery_date: string;
    payment_method: string;
    payment_received: boolean;
    products_value: number;
    total: number;
    delivery_fee: number;
    has_card: boolean;
}

export function DashboardPage(){
    const formRef = useRef<HTMLDivElement>(null);
    const [step, setStep] = useState(1);
    const [client_id, setClientId] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [addressId, setAddressId] = useState("");
    const [newAddress, setNewAddress] = useState(false);
    const [differentReceiver, setDiferentReceiver] = useState(false);
    const [mask, setMask] = useState("(99) 99999-9999");
    const [receiverMask, setReceiverMask] = useState("(99) 99999-9999");

    const navigate = useNavigate();

    const [order, setOrder] = useState<INewOrder>({
        phone_number: "",
        first_name: "",
        last_name: "",
        receiver_name: "",
        receiver_phone: "",
        addressId: addressId,
        street: "",
        street_number: "",
        complement: "",
        reference_point: "",
        neighborhood: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        description: "",
        additional_information: "",
        delivery_date: "",
        payment_method: "",
        payment_received: false,
        products_value: 0.00,
        total: 0.00,
        delivery_fee: 0.00,
        has_card: false
    });

    const handleNextStep = () => {
        if (step < 4) {
            setStep((prevStep) => prevStep + 1);
        }
    }

    const handlePreviousStep = () => {
        setStep((prevStep) => prevStep - 1);
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
    } = useForm<INewOrder>({
        defaultValues: {
            postal_code: "28300000",
            city: "Itaperuna",
            state: "RJ",
            country: "Brasil"
        }
    });

    const onSubmitStep = async ({
        phone_number,
        first_name,
        last_name,
        receiver_name,
        receiver_phone,
        addressId,
        street,
        street_number,
        complement,
        reference_point,
        neighborhood,
        city,
        state,
        postal_code,
        country,
        description,
        additional_information,
        delivery_date,
        payment_method,
        payment_received,
        products_value,
        delivery_fee,
        has_card
    }: INewOrder) => {

        const total = Number(products_value) + Number(delivery_fee);

        const orderData = {
            phone_number: rawTelephone(phone_number),
            first_name,
            last_name,
            receiver_name,
            receiver_phone: receiver_phone ? rawTelephone(receiver_phone) : "",
            addressId,
            street,
            street_number,
            complement,
            reference_point,
            neighborhood,
            city,
            state,
            postal_code,
            country,
            description,
            additional_information,
            delivery_date,
            payment_method,
            payment_received,
            products_value: Number(products_value),
            delivery_fee: Number(delivery_fee),
            total: Number(total),
            status: "OPENED",
            has_card
        }

        if (step === 3) {
            setOrder(orderData);
        }

        if (step === 4) {
            await createOrder({
                clientId: client_id,
                ...orderData,
            })

            navigate("/ordensDeServico");
        }

        handleNextStep();
    };

    const phone_number = watch("phone_number");

    useEffect(() => {
        const fetchClientData = async () => {
            const phoneNumber = rawTelephone(phone_number);


            if (phoneNumber && phoneNumber.length > 7) {
                try {
                    const response = await getClientByPhone(phoneNumber);
                    const { data: client } = response;

                    if (!client) {
                        setClientId("");
                    }

                    if (client) {
                        setValue("first_name", client.first_name);
                        setValue("last_name", client.last_name);
                        setClientId(client.id);
                        const { data: addresses } = await getClientAddresses(client.id);
                    
                        if (addresses) {
                            setAddresses(addresses);
                        }
                    }
                } catch (error) {
                    setError("phone_number", { message: "Usuário não encontrado." });
                }
            }
        };
        
        fetchClientData();
    }, [phone_number, setValue, setError]);

    const watchPhoneNumber = watch("phone_number");

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

    const watchReceiverPhone = watch("receiver_phone");

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

    const handlePrint = () => {
        if (formRef.current) {
            const printWindow = window.open('', '', 'height=800,width=800');
            printWindow?.document.write('<html><head><title>Imprimir Resumo do Pedido</title></head><body>');
            printWindow?.document.write(formRef.current.innerHTML);
            printWindow?.document.write('</body></html>');
            printWindow?.document.close();
            printWindow?.focus();
            printWindow?.print();
        }
    };

    return(
        <Container>
            <NewOrderProgressBar currentStep={step}/>
            <Form onSubmit={handleSubmit(onSubmitStep)} step={step} autoComplete="off">
                <FormHeader>
                    <FontAwesomeIcon icon={faNewspaper} size="3x"/>
                    <h2>Novo Pedido</h2>
                </FormHeader>
                {step === 1 &&
                    <>
                        <FormField>
                            <Label>Telefone</Label>
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
                                <Label>Nome</Label>
                                <Input type="text" autoComplete="off" placeholder="Digite seu nome"
                                    {...register("first_name", {
                                        required: "Nome inválido",
                                    })}
                                    disabled={client_id ? true : false}
                                />
                                {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Sobrenome</Label>
                                <Input type="text" placeholder="Digite seu sobrenome" 
                                    {...register("last_name", {
                                        required: "Sobrenome inválido",
                                    })}
                                    disabled={client_id ? true : false}
                                />
                                {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                            </FormField>
                        </InlineFormField>
                        
                        <CheckboxContainer>
                            <Checkbox type="checkbox"
                                onChange={() => setDiferentReceiver(!differentReceiver)} checked={differentReceiver}/>
                            <Label>Recebedor é Diferente</Label>
                        </CheckboxContainer>
                        
                        {differentReceiver &&
                            <InlineFormField>
                                <FormField>
                                    <Label>Recebedor</Label>
                                    <Input type="text" placeholder="Recebedor"
                                        {...register("receiver_name", {
                                            required: "Nome inválido",
                                        })}
                                    />
                                    {errors.receiver_name && <ErrorMessage>{errors.receiver_name.message}</ErrorMessage>}
                                </FormField>
                                <FormField>
                                    <Label>Telefone do recebedor</Label>
                                    <InputMask
                                        autoComplete="off"
                                        mask={receiverMask}
                                        alwaysShowMask={false}
                                        placeholder='Telefone'
                                        value={watch("receiver_phone") || ""}
                                        {...register("receiver_phone", { 
                                            required: "Telefone inválido",
                                            validate: (value) => {
                                                if (value.replace(/[^0-9]/g, "").length < 10) {
                                                    return "Telefone inválido";
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    {errors.receiver_phone && <ErrorMessage>{errors.receiver_phone.message}</ErrorMessage>}
                                </FormField>
                            </InlineFormField>
                        }
                    </>
                }

                {step === 2 &&
                    <>
                        {addresses.length > 0 && (
                            <>
                                <FormField>
                                    <Label>Selecione o Endereço</Label>
                                    <Select
                                        {...register("addressId")}
                                        onChange={(e) => {
                                            const selectedAddressId = e.target.value;
                                            const selectedAddress: any = addresses.find((address: any) => address.id === selectedAddressId);
                                            console.log(selectedAddress);
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
                                <CheckboxContainer>
                                    <Checkbox type="checkbox" onChange={() => setNewAddress(!newAddress)} checked={newAddress}/>
                                    <Label>Cadastrar novo endereço</Label>
                                </CheckboxContainer>
                            </>
                        )}
                        <InlineFormField>
                            <FormField isShortField>
                                <Label>CEP</Label>
                                <Input type="tel" placeholder="CEP" {...register("postal_code", {
                                    required: "CEP inválido",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.postal_code && <ErrorMessage>{errors.postal_code.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Rua</Label>
                                <Input type="text" placeholder="Rua" {...register("street", {
                                    required: "Rua inválida",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.street && <ErrorMessage>{errors.street.message}</ErrorMessage>}
                            </FormField>
                        </InlineFormField>
                        
                        <InlineFormField>
                            <FormField isShortField>
                                <Label>Número</Label>
                                <Input type="text" placeholder="Número" {...register("street_number", {
                                    required: "Número inválido",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.street_number && <ErrorMessage>{errors.street_number.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Complemento</Label>
                                <Input type="text" placeholder="Complemento" {...register("complement")}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                            </FormField>
                        </InlineFormField>
                        <FormField>
                                <Label>Ponto de referência</Label>
                                <Input type="text" placeholder="Ponto de referência" {...register("reference_point")}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                        </FormField>
                        <InlineFormField>
                            <FormField>
                                <Label>Bairro</Label>
                                <Input type="text" placeholder="Bairro" {...register("neighborhood", {
                                    required: "Bairro inválido",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.neighborhood && <ErrorMessage>{errors.neighborhood.message}</ErrorMessage>}
                            </FormField>
                            <FormField isShortField>
                                <Label>País</Label>
                                <Input type="text" placeholder="País" {...register("country", {
                                    required: "País inválido",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.country && <ErrorMessage>{errors.country.message}</ErrorMessage>}
                            </FormField>
                        </InlineFormField>

                        <InlineFormField>
                            <FormField>
                                <Label>Estado</Label>
                                <Input type="text" placeholder="Estado" {...register("state", {
                                    required: "Estado inválido",
                                    })}
                                    disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                />
                                {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Cidade</Label>
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

                {step === 3 &&
                    <>
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
                                    <Checkbox type="checkbox" {...register("has_card")} />
                                    <Label>Pedido Contém Cartão</Label>
                                </CheckboxContainer>
                            </FormField>
                            <FormField>
                                <CheckboxContainer>
                                    <Checkbox type="checkbox" {...register("payment_received")} />
                                    <Label>Pagamento Recebido</Label>
                                </CheckboxContainer>
                            </FormField>
                        </InlineFormField>
                        
                        <InlineFormField>
                            <FormField>
                                <Label>Data de Entrega</Label>
                                <Input type="date" {...register("delivery_date", {
                                    required: "Data de entrega é obrigatória",
                                })}/>
                                {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Método de pagamento</Label>
                                <Select {...register("payment_method")}>
                                    {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                        <option key={key} value={key}>{value}</option>
                                    ))}
                                </Select>
                            </FormField> 
                        </InlineFormField>
                        <InlineFormField>
                            <FormField>
                                <Label>Valor total dos Produtos</Label>
                                <Input type="number" placeholder="Total" {...register("products_value", {
                                    required: "Valor total é obrigatório",
                                })} />
                                {errors.products_value && <ErrorMessage>{errors.products_value.message}</ErrorMessage>}
                            </FormField>
                            <FormField>
                                <Label>Taxa de entrega</Label>
                                <Input type="number" placeholder="0.00" {...register("delivery_fee", {
                                    required: "Taxa de entrega é obrigatório",
                                })} />
                                {errors.delivery_fee && <ErrorMessage>{errors.delivery_fee.message}</ErrorMessage>}
                            </FormField>
                        </InlineFormField>
                    </>
                }

                {step === 4 &&
                    <OrderSummary ref={formRef}>
                        <h2>Resumo do Pedido</h2>
                        <div>
                            <p>Realizado em {new Date().toLocaleString()}</p>
                        </div>
                        <div>
                            <p><strong>Descrição do pedido:</strong></p>
                            <p>{order.description}</p>
                            <p>Observações:</p>
                            <p>{order.additional_information}</p>
                        </div>
                        <div>
                            <p><strong>Valor dos produtos:</strong> R$ {order.products_value}</p>
                            <p><strong>Taxa de entrega:</strong> R$ {order.delivery_fee}</p>
                            <p><strong>Total:</strong> R$ {Number(order.products_value) + Number(order.delivery_fee)}</p>
                        </div>
                        <div>
                            <p><strong>Cliente:</strong></p>
                            <p>{order.first_name}</p>
                        </div>
                        <div>
                            <p><strong>Endereço:</strong></p>
                            <p>{order.street}, {order.street_number}</p>
                            <p>{order.neighborhood}, {order.city}</p>
                        </div>
                        <button onClick={handlePrint}>
                            <FontAwesomeIcon icon={faPrint} size="2x" />
                        </button>
                    </OrderSummary>
                }
                
                <ActionButtons>
                    {step > 1 && 
                        <StepButton type="button" onClick={handlePreviousStep}>Voltar</StepButton>
                    }
                    <StepButton type="submit">
                        {step < 4 ? "Continuar" : "Finalizar"}
                    </StepButton>
                </ActionButtons>
            </Form>
        </Container>
    )
}