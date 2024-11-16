import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
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
import { useAdminData } from "../../contexts/AuthContext";
import { rawTelephone } from "../../utils";
import { useNavigate } from "react-router-dom";

interface INewOrder {
    phone_number: string;
    first_name: string;
    last_name: string;
    addressId: string;
    street: string;
    street_number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    description: string;
    additional_information: string;
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
    const [mask, setMask] = useState("(99) 99999-9999");
    const { adminData } = useAdminData();
    const navigate = useNavigate();

    const [order, setOrder] = useState<INewOrder>({
        phone_number: "",
        first_name: "",
        last_name: "",
        addressId: "",
        street: "",
        street_number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        description: "",
        additional_information: "",
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
        addressId,
        street,
        street_number,
        complement,
        neighborhood,
        city,
        state,
        postal_code,
        country,
        description,
        additional_information,
        products_value,
        delivery_fee,
        has_card
    }: INewOrder) => {

        const total = Number(products_value) + Number(delivery_fee);

        const orderData = {
            phone_number: rawTelephone(phone_number),
            first_name,
            last_name,
            addressId,
            street,
            street_number,
            complement,
            neighborhood,
            city,
            state,
            postal_code,
            country,
            description,
            additional_information,
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
                admin_id: adminData.id,
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

    useEffect(() => {
        const phoneNumber = watch("phone_number") || "";
        const numericValue = rawTelephone(phoneNumber);
    
        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setMask("(99) 9999-9999");
            } else {
                setMask("(99) 99999-9999");
            }
        }, 1000);

        return () => clearTimeout(timeout);
    }, [watch("phone_number")]);

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
            <Form onSubmit={handleSubmit(onSubmitStep)} step={step}>
                <FormHeader>
                    <FontAwesomeIcon icon={faNewspaper} size="3x"/>
                    <h2>Novo Pedido</h2>
                </FormHeader>
                {step === 1 &&
                    <>
                        <FormField>
                            <Label>Telefone</Label>
                            <InputMask
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
                            <Label>Nome</Label>
                            <Input type="text" placeholder="Digite seu nome"
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
                                            if (selectedAddress) {
                                                setValue("postal_code", selectedAddress.postal_code);
                                                setValue("street", selectedAddress.street);
                                                setValue("street_number", selectedAddress.number);
                                                setValue("city", selectedAddress.city);
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
                        <FormField>
                            <CheckboxContainer>
                                <Checkbox type="checkbox" {...register("has_card")} />
                                <Label>Pedido Contém Cartão</Label>
                            </CheckboxContainer>
                        </FormField>
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