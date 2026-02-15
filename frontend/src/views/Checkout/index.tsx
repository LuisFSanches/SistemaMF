import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../contexts/CartContext";
import { createClientOnline, requestVerificationCode, validateVerificationCode } from "../../services/clientService";
import { getPickupAddress } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import { createMercadoPagoPreference } from "../../services/mercadoPagoService";
import { Loader } from "../../components/Loader";
import { ErrorAlert } from "../../components/ErrorAlert";
import { SuccessAlert } from "../../components/SuccessAlert";
import { WelcomeBackModal } from "../../components/WelcomeBackModal";
import { RememberCardModal } from "../../components/RememberCardModal";
import { TooltipModal } from "../../components/Tooltip";
import { StoreFrontHeader } from "../../components/StoreFrontHeader";
import { convertMoney, rawTelephone } from "../../utils";
import { TYPES_OF_DELIVERY, STATES } from "../../constants";

import {
    FormField,
    Label,
    Input,
    Select,
    Textarea,
    InlineFormField,
    ErrorMessage,
    PrimaryButton,
    Form as GlobalForm
} from "../../styles/global";
import {
    Container,
    Content,
    CartSection,
    SectionTitle,
    OrderSummary,
    SummaryRow,
    CheckboxContainer,
    Checkbox,
    FormFieldTitle,
    ProductsList,
    ProductItem,
    ProductDetails,
    ProductName,
    ProductQuantity,
    ProductPrice,
    Divider,
    CartItemImage,
    CompletedOrder,
    StepperContainer,
    StepperWrapper,
    Step,
    StepCircle,
    StepLabel,
    StepSubLabel,
} from "./style";

interface INewOrder {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    verification_code: string;
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

export function Checkout() {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { cartItems, cartTotal } = useCart();
    const [showLoader, setShowLoader] = useState(false);
    const [mask, setMask] = useState("(99) 99999-9999");
    const [receiverMask, setReceiverMask] = useState("(99) 99999-9999");
    const [countdown, setCountdown] = useState(30);
    const [addresses, setAddresses] = useState([]);
    const [client_id, setClientId] = useState("");
    const [addressId, setAddressId] = useState("");
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [pickupOnStore, setPickupOnStore] = useState(false);
    const [newAddress, setNewAddress] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [showRememberCardModal, setShowRememberCardModal] = useState(false);
    const [cardModalShowed, setCardModalShowed] = useState(false);
    const [showToolTipModal, setShowToolTipModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [currentOrder] = useState<any>(null);
    const cardSectionRef = useRef<HTMLDivElement>(null);
    const previousPhoneRef = useRef<string>("");
    const [awaitingVerification, setAwaitingVerification] = useState(false);
    const [clientExists, setClientExists] = useState(false);
    const [formStarted, setFormStarted] = useState(false);
    const [welcomeClientName, setWelcomeClientName] = useState("");
    const tooltipMessage = `Para entregas em outras regiões,
        por favor entre em contato conosco pelo whatsapp.`;

    const DEFAULT_DELIVERY_FEE = 8.0;
    const deliveryFee = pickupOnStore ? 0 : DEFAULT_DELIVERY_FEE;
    const totalWithDelivery = cartTotal + deliveryFee;
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors, submitCount },
    } = useForm<INewOrder>({
        defaultValues: {
            country: "Brasil",
            state: "RJ",
            city: "Itaperuna",
            postal_code: "28300-000",
            payment_method: "MERCADO_PAGO",
        }
    });

    const submitOrder = async (data: INewOrder) => {
        if (!data.has_card && data.type_of_delivery.includes("GIFT") && !cardModalShowed) {
            setCardModalShowed(true);
            setShowRememberCardModal(true);
            return;
        }

        if (cartItems.length === 0) {
            setErrorMessage("Seu carrinho está vazio");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setShowLoader(true);

        const description = cartItems
            .map((p) => `${p.quantity}x ${p.name} - R$ ${p.price}`)
            .join('\n');

        const products = cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        // Obter store_id do localStorage (salvo no StoreFront)
        const storefrontStoreId = localStorage.getItem('storefront_store_id');

        const orderData = {
            store_id: storefrontStoreId,
            client_id: client_id,
            phone_number: rawTelephone(data.phone_number),
            first_name: data.first_name,
            last_name: data.last_name,
            order_email: data.email,
            pickup_on_store: pickupOnStore,
            address_id: addressId,
            type_of_delivery: data.type_of_delivery,
            street: data.street,
            street_number: data.street_number,
            complement: data.complement,
            reference_point: data.reference_point,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            postal_code: data.postal_code,
            country: data.country,
            receiver_name: data.receiver_name,
            receiver_phone: data.receiver_phone ? rawTelephone(data.receiver_phone) : "",
            delivery_date: data.delivery_date,
            has_card: data.has_card,
            card_message: data.card_message,
            card_from: data.card_from,
            card_to: data.card_to,
            description: description,
            additional_information: "",
            payment_method: "MERCADO_PAGO",
            payment_received: false,
            products_value: cartTotal,
            discount: 0,
            delivery_fee: deliveryFee,
            total: totalWithDelivery,
            status: 'PENDING_PAYMENT',
            products: products,
            is_delivery: !pickupOnStore,
            online_order: false,
            store_front_order: true,
        };

        try {
            const { data: response } = await createOrder({
                clientId: client_id,
                ...orderData,
            });

            // Criar preferência de pagamento e redirecionar para o Mercado Pago
            if (slug) {
                try {
                    const baseUrl = window.location.origin;
                    
                    const preferenceData = {
                        order_id: response.id,
                        store_slug: slug,
                        order_email: data.email,
                        items: cartItems.map(item => ({
                            id: item.id || '',
                            title: item.name,
                            description: item.name,
                            picture_url: item.image,
                            quantity: item.quantity,
                            unit_price: item.price || 0,
                            currency_id: 'BRL'
                        })),
                        shipments: {
                            cost: deliveryFee,
                            mode: 'not_specified'
                        },
                        payer: {
                            name: data.first_name,
                            surname: data.last_name,
                            phone: {
                                area_code: rawTelephone(data.phone_number).substring(0, 2),
                                number: rawTelephone(data.phone_number).substring(2)
                            }
                        },
                        back_urls: {
                            success: `${baseUrl}/${slug}/checkout/success`,
                            failure: `${baseUrl}/${slug}/checkout/failure`,
                            pending: `${baseUrl}/${slug}/checkout/pending`
                        },
                        auto_return: 'approved' as const
                    };

                    const preference = await createMercadoPagoPreference(preferenceData);
                    
                    // Redirecionar para o checkout do Mercado Pago
                    // Em produção usar init_point, em desenvolvimento usar sandbox_init_point
                    const checkoutUrl = process.env.NODE_ENV === 'production' 
                        ? preference.init_point 
                        : preference.sandbox_init_point;
                    
                    // Manter loader ativo durante o redirecionamento
                    window.location.href = checkoutUrl;
                    return;
                } catch (mpError: any) {
                    console.error("Erro ao criar preferência de pagamento:", mpError);
                    setErrorMessage("Erro ao processar pagamento. Tente novamente.");
                    setTimeout(() => setErrorMessage(""), 3000);
                    setShowLoader(false);
                    return;
                }
            }
        } catch (error: any) {
            setErrorMessage("Erro ao criar pedido. Tente novamente.");
            setTimeout(() => setErrorMessage(""), 3000);
            setShowLoader(false);
        }
    };

    const typeOfDelivery = watch("type_of_delivery");
    const hasCard = watch("has_card");
    const watchReceiverPhone = watch("receiver_phone");
    const watchPhoneNumber = watch("phone_number");

    // Busca automática desativada por questões de LGPD
    // useEffect(() => {
    //     const fetchClientData = async () => {
    //         const phoneNumber = rawTelephone(phone_number);
    //
    //         if (phoneNumber && phoneNumber.length >= 10 && phoneNumber !== identifiedUser) {
    //             try {
    //                 setShowLoader(true);
    //                 const response = await getClientByPhone(phoneNumber);
    //                 const { data: client } = response;
    //
    //                 if (!client) {
    //                     setClientId("");
    //                     setValue("first_name", "");
    //                     setValue("last_name", "");
    //                     setShowLoader(false);
    //                 }
    //
    //                 if (client) {
    //                     setValue("first_name", client.first_name);
    //                     setValue("last_name", client.last_name);
    //                     setClientId(client.id);
    //                     const { data: addresses } = await getClientAddresses(client.id);
    //
    //                     if (addresses) {
    //                         setAddresses(addresses);
    //                     }
    //
    //                     setShowLoader(false);
    //
    //                     if (!hasShownWelcomeModal.current || identifiedUser !== client.phone_number) {
    //                         setIdentifiedUser(client.phone_number);
    //                         setShowWelcomeModal(true);
    //                         hasShownWelcomeModal.current = true;
    //                     }
    //                 }
    //             } catch (error) {
    //                 setClientId("");
    //                 setShowLoader(false);
    //             }
    //         }
    //     };
    //
    //     setTimeout(() => {
    //         fetchClientData();
    //     }, 900);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [phone_number, setValue]);

    useEffect(() => {
        const phoneNumber = watch("receiver_phone") || "";
        const numericValue = rawTelephone(phoneNumber);

        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setReceiverMask("(99) 9999-9999");
            } else {
                setReceiverMask("(99) 99999-9999");
            }
        }, 900);

        return () => clearTimeout(timeout);
    }, [watchReceiverPhone, watch]);

    useEffect(() => {
        const phoneNumber = watch("phone_number") || "";
        const numericValue = rawTelephone(phoneNumber);

        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setMask("(99) 9999-9999");
            } else {
                setMask("(99) 99999-9999");
            }
        }, 900);

        return () => clearTimeout(timeout);
    }, [watchPhoneNumber, watch]);

    useEffect(() => {
        if (cartItems.length === 0 && !currentOrder) {
            navigate(`/${slug}`);
        }
    }, [cartItems, currentOrder, navigate, slug]);

    useEffect(() => {
        if (currentOrder?.id) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate(`/${slug}`);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentOrder, navigate, slug]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            let errorMessage = "";

            Object.values(errors).forEach((error) => {
                if (error?.message) {
                    errorMessage += `${error.message}\n - `;
                }
            });

            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        } else {
            setErrorMessage("");
        }
    }, [submitCount, errors]);

    // Resetar formulário quando o telefone for alterado
    useEffect(() => {
        const phoneNumber = watch("phone_number") || "";
        const numericValue = rawTelephone(phoneNumber);

        // Se já tinha iniciado o formulário e o telefone mudou
        if (formStarted && numericValue.length >= 10) {
            const previousPhone = previousPhoneRef.current;
            
            // Se o telefone realmente mudou
            if (previousPhone && previousPhone !== numericValue) {
                // Resetar estados e campos
                setClientId("");
                setClientExists(false);
                setAwaitingVerification(false);
                setFormStarted(false);
                setValue("first_name", "");
                setValue("last_name", "");
                setValue("verification_code", "");
                setAddresses([]);
                clearErrors(["first_name", "last_name", "verification_code"]);
            }
        }
        
        // Atualizar o telefone anterior
        if (numericValue.length >= 10) {
            previousPhoneRef.current = numericValue;
        }
    }, [watchPhoneNumber, formStarted, watch, setValue, clearErrors]);

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
    };

    const handleWriteMessageClick = () => {
        setValue("has_card", true);
        setShowRememberCardModal(false);

        setTimeout(() => {
            cardSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleNoMessageClick = () => {
        setShowRememberCardModal(false);
        handleSubmit(submitOrder)();
    };

    const handleCreateUser = async () => {
        const phoneNumber = watch('phone_number');
        const email = watch('email');
        const firstName = watch('first_name');
        const lastName = watch('last_name');

        if (!phoneNumber || !email) {
            setError("phone_number", { message: "Preencha o telefone e o email" });
            setError("email", { message: "Preencha o telefone e o email" });
            return;
        }

        setError("phone_number", { message: "" });
        setError("email", { message: "" });

        setShowLoader(true);
        setFormStarted(true);

        try {
            const { data } = await requestVerificationCode({
                phone_number: rawTelephone(phoneNumber),
                email: email,
            });

            // Armazenar o telefone atual como referência
            previousPhoneRef.current = rawTelephone(phoneNumber);

            if (data.client_exists) {
                // Cliente existe, solicitar código de verificação
                setClientExists(true);
                setAwaitingVerification(true);
                setWelcomeClientName(data.first_name);
                setShowWelcomeModal(true);
            } else {
                // Cliente não existe, criar novo cliente
                if (!firstName || !lastName) {
                    setError("first_name", { message: "Preencha seu nome" });
                    setError("last_name", { message: "Preencha seu sobrenome" });
                    setShowLoader(false);
                    return;
                }

                const { data: clientData } = await createClientOnline({
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: rawTelephone(phoneNumber),
                    email: email,
                });

                setClientId(clientData.id);
                setSuccessMessage('Cliente criado com sucesso!');
                setTimeout(() => { setSuccessMessage('') }, 3000);
            }
        } catch (error: any) {
            console.error(error);            
            let errorMsg = 'Algo deu errado, por favor tente novamente';
            
            setErrorMessage(errorMsg);
            setTimeout(() => { setErrorMessage('') }, 5000);
        } finally {
            setShowLoader(false);
        }
    };

    const handleValidateCode = async () => {
        const phoneNumber = watch('phone_number');
        const code = watch('verification_code');

        if (!code || code.length !== 6) {
            setError("verification_code", { message: "Digite o código de 6 dígitos" });
            return;
        }

        setError("verification_code", { message: "" });
        setShowLoader(true);

        try {
            const { data } = await validateVerificationCode({
                phone_number: rawTelephone(phoneNumber),
                code: code,
            });

            if (data.valid && data.client) {
                // Preencher dados do cliente
                setValue("first_name", data.client.first_name);
                setValue("last_name", data.client.last_name);
                // Email já está preenchido pelo usuário, não precisa setValue
                
                // Limpar erros de validação dos campos preenchidos
                clearErrors(["first_name", "last_name"]);
                
                setClientId(data.client.id);

                // Carregar endereços
                if (data.client.addresses && data.client.addresses.length > 0) {
                    setAddresses(data.client.addresses);
                }

                setAwaitingVerification(false);
                setSuccessMessage('Código validado com sucesso!');
                setTimeout(() => { setSuccessMessage('') }, 3000);
            }
        } catch (error: any) {
            console.error(error);
            const errorMsg = error?.response?.data?.message || 'Código inválido ou expirado';
            setError("verification_code", { message: errorMsg });
            setErrorMessage(errorMsg);
            setTimeout(() => { setErrorMessage('') }, 3000);
        } finally {
            setShowLoader(false);
        }
    };

    return (
        <Container>
            <WelcomeBackModal
                isOpen={showWelcomeModal}
                onRequestClose={() => setShowWelcomeModal(false)}
                name={welcomeClientName}
                textBody="Digite o código enviado para o seu e-mail para confirmar sua identidade"
            />
            <RememberCardModal
                isOpen={showRememberCardModal}
                onRequestClose={() => setShowRememberCardModal(false)}
                handleWriteMessageClick={handleWriteMessageClick}
                handleNoMessageClick={handleNoMessageClick}
            />
            <TooltipModal
                isOpen={showToolTipModal}
                onRequestClose={() => setShowToolTipModal(false)}
                textContent={tooltipMessage}
                title=""
                showWhatsapp
                showCopyButton={false}
            />
            <Loader show={showLoader} />
            {errorMessage && <ErrorAlert message={errorMessage} />}
            {successMessage && <SuccessAlert message={successMessage} />}

            <StoreFrontHeader 
                showBackButton 
                backButtonText="Voltar ao Carrinho"
                backButtonPath={`/${slug}/carrinho`}
                slug={slug}
            />

            <StepperContainer>
                <StepperWrapper>
                    {["Carrinho", "Informações do Pedido", "Pagamento"].map((stepName, index) => {
                        const stepNumber = index + 1;
                        const currentStep = 2;
                        const isActive = currentStep === stepNumber;
                        const isCompleted = currentStep > stepNumber;
                        const isClickable = currentStep > stepNumber;
                        
                        return (
                            <Step 
                                key={stepNumber} 
                                active={isActive} 
                                completed={isCompleted}
                                clickable={isClickable}
                                onClick={() => isClickable && navigate(`/${slug}/carrinho`)}
                            >
                                <StepCircle active={isActive} completed={isCompleted}>
                                    {isCompleted ? '✓' : stepNumber}
                                </StepCircle>
                                <StepLabel active={isActive}>{stepName}</StepLabel>
                                <StepSubLabel>
                                    {stepNumber === 1 && 'Revise seus itens'}
                                    {stepNumber === 2 && 'Dados de entrega'}
                                    {stepNumber === 3 && 'Finalize o pedido'}
                                </StepSubLabel>
                            </Step>
                        );
                    })}
                </StepperWrapper>
            </StepperContainer>

            <Content>
                {!currentOrder?.id &&
                    <>
                        <CartSection>
                            <GlobalForm onSubmit={handleSubmit(submitOrder)}>
                                <FormFieldTitle>Dados do Comprador</FormFieldTitle>
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
                                        disabled={awaitingVerification}
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
                                        Seu email
                                        <span>*</span>
                                    </Label>
                                    <Input 
                                        type="email" 
                                        autoComplete="email" 
                                        placeholder="Digite seu email"
                                        disabled={awaitingVerification || !!client_id}
                                        {...register("email", {
                                            required: "Email inválido",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Email inválido"
                                            }
                                        })}
                                    />
                                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                                </FormField>

                                {awaitingVerification && (
                                    <FormField>
                                        <Label>
                                            Código de Verificação
                                            <span>*</span>
                                        </Label>
                                        <Input 
                                            type="text" 
                                            autoComplete="off" 
                                            placeholder="Digite o código de 6 dígitos"
                                            maxLength={6}
                                            {...register("verification_code", {
                                                required: "Digite o código",
                                                minLength: {
                                                    value: 6,
                                                    message: "Código deve ter 6 dígitos"
                                                },
                                                maxLength: {
                                                    value: 6,
                                                    message: "Código deve ter 6 dígitos"
                                                }
                                            })}
                                        />
                                        {errors.verification_code && <ErrorMessage>{errors.verification_code.message}</ErrorMessage>}
                                        <PrimaryButton type="button" onClick={handleValidateCode} style={{ marginTop: '10px' }}>
                                            Validar Código
                                        </PrimaryButton>
                                    </FormField>
                                )}

                                {((formStarted && !awaitingVerification && !clientExists) || client_id) && (
                                    <InlineFormField>
                                        <FormField>
                                            <Label>
                                                Seu nome
                                                <span>*</span>
                                            </Label>
                                            <Input 
                                                type="text" 
                                                autoComplete="off" 
                                                placeholder="Digite seu nome"
                                                disabled={!!client_id}
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
                                            <Input 
                                                type="text" 
                                                placeholder="Digite seu sobrenome"
                                                disabled={!!client_id}
                                                {...register("last_name", {
                                                    required: "Sobrenome inválido",
                                                })}
                                            />
                                            {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                                        </FormField>
                                    </InlineFormField>
                                )}

                                {!client_id && !awaitingVerification &&
                                    <PrimaryButton type="button" onClick={handleCreateUser}>
                                        Continuar
                                    </PrimaryButton>
                                }

                                {client_id && (
                                    <>
                                        <FormFieldTitle>Informações de Entrega</FormFieldTitle>
                                        <FormField>
                                            <Label>
                                                Informe sobre a entrega
                                                <span>*</span>
                                            </Label>
                                            <Select {...register("type_of_delivery", { required: "Campo obrigatório" })}>
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
                                                            required: "Telefone inválido"
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
                                                }} checked={pickupOnStore} />
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

                                                        }} checked={newAddress} />
                                                        <Label noMargin>Cadastrar novo endereço</Label>
                                                    </CheckboxContainer>

                                                    <CheckboxContainer>
                                                        <Checkbox type="checkbox" onChange={(e) => {
                                                            setPickupOnStore(!pickupOnStore)
                                                            handlePickUpAddress(e.target.checked);

                                                        }} checked={pickupOnStore} />
                                                        <Label noMargin>Retirar na Loja</Label>
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
                                                        <Select disabled {...register("state", {
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
                                                        <Label style={{ display: "flex" }}>
                                                            <div>
                                                                Cidade
                                                                <span>*</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="label-question"
                                                                onClick={() => setShowToolTipModal(!showToolTipModal)}>
                                                                <FontAwesomeIcon icon={faCircleQuestion as any}
                                                                />
                                                            </button>
                                                        </Label>
                                                        <Input type="text" placeholder="Cidade" {...register("city", {
                                                            required: "Cidade inválido",
                                                        })}
                                                            disabled
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
                                            })} />
                                            {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                                        </FormField>

                                        <FormField>
                                            <CheckboxContainer>
                                                <Checkbox type="checkbox" {...register("has_card")} />
                                                <Label>Pedido Contém Cartão de Mensagem.</Label>
                                            </CheckboxContainer>
                                        </FormField>

                                        {hasCard &&
                                            <>
                                                <FormField ref={cardSectionRef}>
                                                    <Label>
                                                        De: <span>*</span>
                                                    </Label>
                                                    <Input {...register("card_from", {
                                                        required: "Remetente do cartão é obrigatório",
                                                    })} />
                                                    {errors.card_from && <ErrorMessage>{errors.card_from.message}</ErrorMessage>}
                                                </FormField>
                                                <FormField>
                                                    <Label>
                                                        Para: <span>*</span>
                                                    </Label>
                                                    <Input {...register("card_to", {
                                                        required: "Destinatário do cartão é obrigatório",
                                                    })} />
                                                    {errors.card_to && <ErrorMessage>{errors.card_to.message}</ErrorMessage>}
                                                </FormField>
                                                <FormField>
                                                    <Label>Mensagem do cartão <span>*</span></Label>
                                                    <Textarea {...register("card_message", { required: "Mensagem do cartão é obrigatório", })}
                                                    />
                                                    {errors.card_message && <ErrorMessage>{errors.card_message.message}</ErrorMessage>}
                                                </FormField>
                                            </>
                                        }

                                        <PrimaryButton type="submit">Finalizar Pedido</PrimaryButton>
                                    </>
                                )}
                            </GlobalForm>
                        </CartSection>

                        <OrderSummary>
                            <SectionTitle>Resumo do Pedido</SectionTitle>
                            
                            {cartItems.length > 0 && (
                                <>
                                    <ProductsList>
                                        {cartItems.map((item) => (
                                            <ProductItem key={item.id}>
                                                <ProductDetails>
                                                    <CartItemImage
                                                        src={item.image}
                                                        alt={item.name}
                                                    />
                                                    <div>
                                                        <ProductName>{item.name}</ProductName>
                                                        <ProductQuantity>Quantidade: {item.quantity}</ProductQuantity>
                                                    </div>
                                                </ProductDetails>
                                                <ProductPrice>
                                                    {convertMoney((item.price || 0) * item.quantity)}
                                                </ProductPrice>
                                            </ProductItem>
                                        ))}
                                    </ProductsList>
                                    <Divider />
                                </>
                            )}
                            
                            <SummaryRow>
                                <span>Subtotal:</span>
                                <span>{convertMoney(cartTotal)}</span>
                            </SummaryRow>
                            <SummaryRow>
                                <span>Taxa de Entrega:</span>
                                <span>{convertMoney(deliveryFee)}</span>
                            </SummaryRow>
                            <SummaryRow className="total">
                                <span>Total:</span>
                                <span>{convertMoney(totalWithDelivery)}</span>
                            </SummaryRow>
                        </OrderSummary>
                    </>
                }
            </Content>

            {currentOrder &&
                <CompletedOrder>
                    <h1>Seu pedido #{currentOrder?.code} foi enviado para a loja!</h1>
                    {!currentOrder?.payment_received &&
                        <>
                            <h2>Para concluir, finalize o pagamento com nosso atendente no WhatsApp.</h2>
                            <h2>Assim que confirmado, daremos sequência ao seu pedido.</h2>
                            <p>🌺🌻🌸</p>
                        </>
                    }

                    {currentOrder?.payment_received &&
                        <h2>Qualquer dúvida entre em contato conosco.</h2>
                    }

                    <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                        Você será redirecionado para a página inicial em {countdown} segundo{countdown !== 1 ? 's' : ''}...
                    </p>
                </CompletedOrder>
            }
        </Container>
    );
}
