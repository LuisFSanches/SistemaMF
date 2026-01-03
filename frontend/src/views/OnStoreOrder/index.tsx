import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer } from "@fortawesome/free-solid-svg-icons";
import { ProductCard} from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import { QRCodeScanner } from "../../components/QRCodeScanner";
import { ProductConfirmModal } from "../../components/ProductConfirmModal";
import {
    Container,
    FormHeader,
    Form,
    ActionButtons,
    ErrorMessage,
    CheckboxContainer,
    Checkbox,
    NewOrderContainer,
    ProductContainer,
    NewProductButton,
    ProductList,
    FormContainer,
    DiscountSwitch,
    DiscountSwitchLabel,
    PriceSummary,
    StepperContainer,
    StepperWrapper,
    Step,
    StepCircle,
    StepLabel,
    StepSubLabel,
    SearchContainer,
    SearchInput,
    SearchButton,
    CartContainer,
    CartHeader,
    CartBadge,
    CartItems,
    CartItem,
    CartItemInfo,
    CartItemName,
    CartItemPrice,
    CartItemQuantity,
    CartTotal,
    ContinueButton,
    ProductHeaderContainer,
    ProductHeaderContent,
    CartEmptyMessage,
    RemoveProductButton,
    MaterialIcon,
    DiscountSection,
    DiscountLabel,
    DiscountInputContainer,
    DiscountInput,
    DiscountAppliedText,
    TotalSection,
    TotalLabel,
    TotalValue,
    FormSubtitle,
    SectionCard,
    SectionHeader,
    DeliveryToggleContainer,
    DeliveryToggleContent,
    HiddenCheckbox,
    SummarySection,
    SummarySectionTitle,
    ProductSummaryItem,
    ProductSummaryName,
    ProductSummaryQuantity,
    ProductSummaryPrice,
    SummaryInfoText,
    SummaryDivider,
    BackButton
} from "./style";

import {
    FormField,
    Label,
    Input,
    Select,
    Textarea,
    InlineFormField,
    PrimaryButton
} from "../../styles/global";

import { ProductModal } from "../../components/ProductModal";
import { CompletedOrderModal } from "../../components/CompletedOrderModal";
import { Loader } from '../../components/Loader';
import { getClientByPhone } from "../../services/clientService";
import { getClientAddresses } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import { getProductById } from "../../services/productService";
import { rawTelephone } from "../../utils";
import { PAYMENT_METHODS, STATES } from "../../constants";
import { useOrders } from "../../contexts/OrdersContext";
import { useAdmins } from "../../contexts/AdminsContext";
import { useProducts } from "../../contexts/ProductsContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import placeholder_products from '../../assets/images/placeholder_products.png';

interface INewOrder {
    phone_number: string;
    first_name: string;
    last_name: string;
    receiver_name: string;
    receiver_phone: string;
    addressId: string;
    pickup_on_store: boolean;
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
    products_value: any;
    discount: number;
    total: number;
    delivery_fee: number;
    has_card: boolean;
    created_by: string;
}

interface IProduct {
    id?: string;
    name: string;
    price: number;
    image?: string;
    quantity?: number;
}

export function OnStoreOrder() {
    const { addOrder } = useOrders();
    const { admins } = useAdmins();
    const { products: availableProducts, loadAvailableProducts, totalProducts, refreshProducts } = useProducts();
    const { showSuccess } = useSuccessMessage();

    const [step, setStep] = useState(1);
    const [client_id, setClientId] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [addressId, setAddressId] = useState("");
    const [newAddress, setNewAddress] = useState(false);
    const [pickupOnStore, setPickupOnStore] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>({});
    const [differentReceiver, setDiferentReceiver] = useState(false);
    const [mask, setMask] = useState("(99) 99999-9999");
    const [receiverMask, setReceiverMask] = useState("(99) 99999-9999");
    const [showLoader, setShowLoader] = useState(false);
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productModal, setProductModal] = useState(false);
    // Calcula o pageSize inicial baseado na largura da tela
    const getInitialPageSize = () => {
        const width = window.innerWidth;
        if (width < 800) return 4;
        if (width < 1300) return 4;
        if (width < 1600) return 8;
        if (width < 1900) return 10;
        if (width < 2250) return 12;
        return 14;
    };

    const [page, setPage] = useState(1);
    const [pageSize] = useState(getInitialPageSize());
    const [steps, setSteps] = useState(["Produtos", "Pedido", "Cliente", "Resumo"]);
    const [is_delivery, setIsDelivery] = useState(false);
    const [orderStatus, setOrderStatus] = useState<"OPENED" | "DONE">("OPENED");
    const [showCompletedModal, setShowCompletedModal] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const [orderCode, setOrderCode] = useState("");
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showProductConfirm, setShowProductConfirm] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<any>(null);
    const [isPercentageDiscount, setIsPercentageDiscount] = useState(false);
    const [cartExpanded, setCartExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const [order, setOrder] = useState<INewOrder>({
        phone_number: "",
        first_name: "",
        last_name: "",
        receiver_name: "",
        receiver_phone: "",
        addressId: addressId,
        pickup_on_store: pickupOnStore,
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
        discount: 0.00,
        total: 0.00,
        delivery_fee: 0.00,
        has_card: false,
        created_by: ""
    });

    const handleNextStep = () => {
        if (step < 4) {
            setStep((prevStep) => prevStep + 1);
        }
    }

    const handlePreviousStep = () => {
        if (step > 1) {
            setStep((prevStep) => prevStep - 1);
        }
    }

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        formState: { errors },
        reset
    } = useForm<INewOrder>({
        defaultValues: {
            postal_code: "28300000",
            city: "Itaperuna",
            state: "RJ",
            country: "Brasil"
        },
        shouldFocusError: false
    });

    // Calcula o desconto absoluto baseado no tipo (% ou valor)
    const calculateAbsoluteDiscount = (discountValue: number, productsValue: number) => {
        if (!discountValue) return 0;
        if (isPercentageDiscount) {
            return (productsValue * discountValue) / 100;
        }
        return discountValue;
    };

    // Watch para recalcular o total quando mudar desconto ou produtos
    const productsValue = watch("products_value") || 0;
    const discountInput = watch("discount") || 0;
    const deliveryFee = watch("delivery_fee") || 0;

    const absoluteDiscount = calculateAbsoluteDiscount(Number(discountInput), Number(productsValue));
    const totalValue = Number(productsValue) - absoluteDiscount + Number(deliveryFee);

    const onSubmitStep = async ({
        phone_number,
        first_name,
        last_name,
        receiver_name,
        receiver_phone,
        addressId,
        pickup_on_store,
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
        discount,
        delivery_fee,
        has_card,
        created_by
    }: INewOrder) => {

        // Validação específica do Step 3 (Cliente)
        if (step === 3) {
            // Se for entrega, valida os campos obrigatórios
            if (is_delivery) {
                if (!phone_number || rawTelephone(phone_number).length < 10) {
                    return; // O react-hook-form já mostra o erro
                }
                if (!first_name) {
                    return; // O react-hook-form já mostra o erro
                }
                if (!last_name) {
                    return; // O react-hook-form já mostra o erro
                }
                
                // Valida endereço se não for pickup
                if (!pickup_on_store) {
                    if (!street || !street_number || !neighborhood || !city || !state || !postal_code) {
                        return; // O react-hook-form já mostra os erros
                    }
                }
            }
        }

        // Calcula o desconto absoluto para enviar ao backend
        const absoluteDiscountValue = calculateAbsoluteDiscount(Number(discount) || 0, Number(products_value));
        const total = Number(products_value) - absoluteDiscountValue + Number(delivery_fee);

        const orderData = {
            phone_number: phone_number ? rawTelephone(phone_number) : "",
            first_name,
            last_name,
            receiver_name,
            receiver_phone: receiver_phone ? rawTelephone(receiver_phone) : "",
            addressId,
            pickup_on_store,
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
            discount: absoluteDiscountValue,
            delivery_fee: Number(delivery_fee),
            total: Number(total),
            status: orderStatus,
            has_card,
            created_by,
            products
        }

        if (step === 1 || step === 2 || step === 3) {
            setOrder(orderData);
        }

        if (step === 4) {
            setShowLoader(true);
            const { data } = await createOrder({
                clientId: client_id,
                ...orderData,
                is_delivery
            })

            setOrderCode(data.code);

            addOrder(data);
            
            showSuccess("Pedido criado com sucesso!");

            if (orderStatus === "DONE") {
                setShowLoader(false);
                setShowCompletedModal(true);
            } else {
                navigate("/backoffice/ordensDeServico");
            }

        }

        handleNextStep();
    };

    const handleCloseCompleteModal = () => {
        setShowCompletedModal(false);
        setStep(1);
        setProducts([]);
        reset();
        setValue('delivery_date', today);
        setValue('payment_received', true);
    }

    const phone_number = watch("phone_number");

    useEffect(() => {
        const fetchClientData = async () => {
            const phoneNumber = rawTelephone(phone_number);

            if (phoneNumber && phoneNumber.length >= 10 && step === 3) {
                try {
                    const response = await getClientByPhone(phoneNumber);
                    const { data: client } = response;

                    if (!client) {
                        setClientId("");
                        setAddresses([]);
                        setValue("first_name", "");
                        setValue("last_name", "");
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
                    setClientId("");
                    setAddresses([]);
                }
            }
        };
        
        fetchClientData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleSearchProducts = (text: string) => {
        setQuery(text);
        setPage(1);
    };

    const handleAddProduct = (product: IProduct, quantity: number, price: number) => {
        setProducts((prev: IProduct[]) => {
            const existingIndex = prev.findIndex((p) => p.id === product.id);
            let updated;

            if (existingIndex !== -1) {
                const existing = prev[existingIndex];
                const newQuantity = (existing.quantity || 0) + quantity;

                // Recalcula o preço médio ponderado
                const newPrice = (
                    ((existing.quantity || 0) * existing.price + quantity * price) /
                    newQuantity
                );

                updated = [...prev];
                updated[existingIndex] = {
                    ...existing,
                    quantity: newQuantity,
                    price: Number(newPrice.toFixed(2)),
                };
            } else {
                updated = [
                    ...prev,
                    {
                        ...product,
                        quantity,
                        price: Number(price),
                    },
                ];
            }

            const total = updated.reduce((sum, p) => {
                return sum + Number(p.quantity) * Number(p.price);
            }, 0);

            const formattedTotal = total > 0 ? total.toFixed(2) : 0;

            setValue("products_value", formattedTotal);
            return updated;
        });
    };

    const removeProduct = (product: any) => {
        setProducts((prev: any) => {
            const updated = prev.filter((p: any) => p.id !== product.id);
        
            // recalcula o Total dos Produtos
            const total = updated.reduce((sum: any, p: any) => {
            return sum + Number(p.quantity) * Number(p.price);
            }, 0);

            const formattedTotal = total > 0 ? total.toFixed(2) : 0;
        
            setValue("products_value", formattedTotal);
        
            return updated;
        });
    };

    function handleOpenProductModal() {
        setProductModal(true);
    }
    
    function handleCloseProductModal() {
        setProductModal(false);
    }

    const handleQRCodeScan = async (decodedText: string) => {
        try {
            setShowLoader(true);
            const { data: product } = await getProductById(decodedText);
            
            if (product) {
                setScannedProduct(product);
                setShowProductConfirm(true);
            }
        } catch (error) {
            console.error("Erro ao buscar produto por QR Code:", error);
            alert("Produto não encontrado. Verifique o QR Code.");
        } finally {
            setShowLoader(false);
        }
    };

    const handleConfirmProduct = (quantity: number, price: number, image: string) => {
        if (scannedProduct) {
            handleAddProduct(
                {
                    id: scannedProduct.id,
                    name: scannedProduct.name,
                    price: price,
                    quantity: quantity,
                    image: image
                },
                quantity,
                price
            );
            showSuccess(`${quantity}x ${scannedProduct.name} adicionado ao pedido!`);
            setScannedProduct(null);
        }
    };

    const description = products
        .map((p) => `${p.quantity}x ${p.name} - R$ ${p.price}`)
        .join('\n');

    useEffect(() => {
        setValue('description', description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description]);

    useEffect(() => {
        // Verifica se já está no step 1 (produtos) antes de carregar
        if (step === 1) { 
            setShowLoader(true);
            setTimeout(() => {
                loadAvailableProducts(page, pageSize, query).then(() => {
                    setShowLoader(false);
                }).catch(() => {
                    setShowLoader(false);
                });;
                setShowLoader(false);
            }, 120);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query, step]);

    useEffect(() => {
        if (is_delivery) {
            setSteps(["Produtos", "Pedido", "Cliente", "Resumo"]);
            setPickupOnStore(false);
            
            if (client_id) {
                getClientAddresses(client_id).then(({ data: addresses }) => {
                    if (addresses) {
                        setAddresses(addresses);
                    }
                });
            }
        } else {
            setSteps(["Produtos", "Pedido", "Cliente", "Resumo"]);
            setValue("delivery_date", today);
            setPickupOnStore(true);
            setValue("payment_received", true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_delivery]);
    
    return(
        <Container>
            {/* Modals */}
            <ProductModal 
                isOpen={productModal}
                onRequestClose={handleCloseProductModal}
                loadData={refreshProducts}
                action={"create"}
                currentProduct={{
                    id: "",
                    name: "",
                    image: "",
                    price: 0,
                    unity: "",
                    stock: 0,
                    enabled: false
                }}
            />
            
            <CompletedOrderModal
                isOpen={showCompletedModal}
                onRequestClose={handleCloseCompleteModal}
                order={order}
                orderCode={orderCode}
                admins={admins}
            />

            <QRCodeScanner
                isOpen={showQRScanner}
                onRequestClose={() => setShowQRScanner(false)}
                onScanSuccess={handleQRCodeScan}
            />

            <ProductConfirmModal
                isOpen={showProductConfirm}
                onRequestClose={() => {
                    setShowProductConfirm(false);
                    setScannedProduct(null);
                }}
                product={scannedProduct}
                onConfirm={handleConfirmProduct}
                productImage={scannedProduct?.image || placeholder_products}
            />

            <Loader show={showLoader} />

            {/* Stepper no topo */}
            <StepperContainer>
                <StepperWrapper>
                    {steps.map((stepName, index) => {
                        const stepNumber = index + 1;
                        const isActive = step === stepNumber;
                        const isCompleted = step > stepNumber;
                        const isClickable = step > stepNumber;
                        
                        return (
                            <Step 
                                key={stepNumber} 
                                active={isActive} 
                                completed={isCompleted}
                                clickable={isClickable}
                                onClick={() => isClickable && setStep(stepNumber)}
                            >
                                <StepCircle active={isActive} completed={isCompleted}>
                                    {isCompleted ? '✓' : stepNumber}
                                </StepCircle>
                                <StepLabel active={isActive}>{stepName}</StepLabel>
                                <StepSubLabel>
                                    {stepNumber === 1 && 'Selecione os itens'}
                                    {stepNumber === 2 && 'Configurações do pedido'}
                                    {stepNumber === 3 && 'Dados e endereço'}
                                    {stepNumber === 4 && 'Confirme o pedido'}
                                </StepSubLabel>
                            </Step>
                        );
                    })}
                </StepperWrapper>
            </StepperContainer>

            {/* Conteúdo Principal */}
            {step === 1 && (
                <NewOrderContainer>
                    {/* Coluna de Produtos */}
                    <ProductContainer>
                        <ProductHeaderContainer>
                            <ProductHeaderContent>
                                <h2>Escolha os Produtos</h2>
                                <p>Selecione as flores e arranjos para o pedido</p>
                            </ProductHeaderContent>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <NewProductButton type="button" onClick={() => setShowQRScanner(true)}>
                                    <MaterialIcon className="material-icons" $size="1.2rem">qr_code_scanner</MaterialIcon>
                                    Escanear Produto
                                </NewProductButton>
                                <NewProductButton type="button" onClick={handleOpenProductModal}>
                                    + Novo Produto
                                </NewProductButton>
                            </div>
                        </ProductHeaderContainer>

                        <SearchContainer>
                            <FontAwesomeIcon icon={faComputer as any} />
                            <SearchInput
                                placeholder="Buscar produtos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        handleSearchProducts(searchQuery);
                                    }
                                }}
                            />
                            <SearchButton type="button" onClick={() => handleSearchProducts(searchQuery)}>
                                <MaterialIcon className="material-icons" $size="1.2rem">search</MaterialIcon>
                            </SearchButton>
                        </SearchContainer>
                        <ProductList>
                            {availableProducts.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    image={product.image ? product.image : placeholder_products}
                                    onAdd={handleAddProduct}
                                />
                            ))}
                        </ProductList>

                        <Pagination
                            currentPage={page}
                            total={totalProducts}
                            pageSize={pageSize as number}
                            onPageChange={setPage}
                        />
                    </ProductContainer>

                    {/* Carrinho Lateral */}
                    <CartContainer expanded={cartExpanded}>
                        <CartHeader onClick={() => setCartExpanded(!cartExpanded)} expanded={cartExpanded}>
                            <h3>
                                <MaterialIcon className="material-icons cart" $size="1.3rem">shopping_bag</MaterialIcon>
                                Seu Pedido
                                {products.length > 0 && <CartBadge>{products.length}</CartBadge>}
                            </h3>
                            <MaterialIcon className="material-icons" style={{ transform: cartExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>expand_more</MaterialIcon>
                        </CartHeader>

                        <CartItems expanded={cartExpanded}>
                            {products.length === 0 ? (
                                <CartEmptyMessage>
                                    Nenhum item no carrinho
                                </CartEmptyMessage>
                            ) : (
                                products.map((product, index) => (
                                    <CartItem key={index}>
                                        <img src={product.image ? product.image : placeholder_products}
                                            alt={product.name} />
                                        <CartItemInfo>
                                            <CartItemName>{product.name}</CartItemName>
                                            <CartItemPrice>R$ {Number(product.price).toFixed(2)}</CartItemPrice>
                                            <CartItemQuantity>
                                                <span>Qtd: {product.quantity}</span>
                                                <RemoveProductButton
                                                    type="button"
                                                    onClick={() => removeProduct(product)}
                                                >
                                                    <MaterialIcon className="material-icons">delete</MaterialIcon>
                                                </RemoveProductButton>
                                            </CartItemQuantity>
                                        </CartItemInfo>
                                    </CartItem>
                                ))
                            )}
                        </CartItems>

                        <CartTotal expanded={cartExpanded}>
                            <span>Subtotal</span>
                            <span>R$ {Number(productsValue).toFixed(2)}</span>
                        </CartTotal>

                        {/* Taxa de Entrega */}
                        <DiscountSection expanded={cartExpanded}>
                            <DiscountInputContainer>
                                <DiscountLabel style={{ fontSize: '15px' }}>
                                Taxa de Entrega
                                </DiscountLabel>
                                <DiscountInput
                                    type="number" 
                                    step="0.01" 
                                    placeholder="0.00" 
                                    defaultValue={0}
                                    {...register("delivery_fee")} 
                                />
                            </DiscountInputContainer>
                        </DiscountSection>

                        {/* Tipo de Desconto */}
                        <DiscountSection expanded={cartExpanded}>
                            <DiscountLabel>
                                Desconto
                            </DiscountLabel>
                            <DiscountInputContainer>
                                <DiscountSwitch style={{ marginBottom: '12px', fontSize: '0.875rem' }}>
                                    <span style={{ color: isPercentageDiscount ? "#5B5B5B" : "#EC4899" }}>R$</span>
                                    <Input
                                        id="discount-switch" 
                                        type="checkbox" 
                                        checked={isPercentageDiscount}
                                        onChange={(e) => setIsPercentageDiscount(e.target.checked)}
                                    />
                                    <DiscountSwitchLabel htmlFor="discount-switch" $checked={isPercentageDiscount} />
                                    <span style={{ color: isPercentageDiscount ? "#EC4899" : "#5B5B5B" }}>%</span>
                                </DiscountSwitch>
                                <DiscountInput
                                    type="number" 
                                    step="0.01" 
                                    placeholder={isPercentageDiscount ? "0.00%" : "0.00"} 
                                    defaultValue={0}
                                    {...register("discount")} 
                                />
                            </DiscountInputContainer>
                            {absoluteDiscount > 0 && (
                                <DiscountAppliedText>
                                    Desconto aplicado: R$ {absoluteDiscount.toFixed(2)}
                                </DiscountAppliedText>
                            )}
                        </DiscountSection>

                        {/* Total Final */}
                        <TotalSection expanded={cartExpanded}>
                            <TotalLabel>Total</TotalLabel>
                            <TotalValue>
                                R$ {totalValue.toFixed(2)}
                            </TotalValue>
                        </TotalSection>

                        <ContinueButton
                            type="button"
                            onClick={() => products.length > 0 && handleNextStep()}
                            disabled={products.length === 0}
                            expanded={cartExpanded}
                        >
                            Continuar
                        </ContinueButton>
                    </CartContainer>
                </NewOrderContainer>
            )}

            {/* Step 2, 3 e 4 - Formulário */}
            {(step === 2 || step === 3 || step === 4) && (
                <FormContainer>
                    <Form onSubmit={handleSubmit(onSubmitStep)} autoComplete="off">
                        {step === 2 && (
                            <>
                                <FormHeader>
                                    <FormSubtitle>
                                        Defina os detalhes e condições do pedido
                                    </FormSubtitle>
                                </FormHeader>

                                <FormField>
                                    <Label>Observações</Label>
                                    <Textarea
                                        style={{ minHeight: '110px' }}
                                        placeholder="Informações adicionais sobre o pedido..."
                                        {...register("additional_information")}
                                    />
                                </FormField>

                                <InlineFormField>
                                    <FormField>
                                        <Label>Data de Entrega</Label>
                                        <Input type="date" {...register("delivery_date", {
                                            required: "Data obrigatória",
                                        })}/>
                                        {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                                    </FormField>
                                    <FormField>
                                        <Label>Método de Pagamento</Label>
                                        <Select {...register("payment_method")}>
                                            {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </Select>
                                    </FormField>
                                </InlineFormField>

                                <FormField>
                                    <Label>Vendedor Responsável</Label>
                                    <Select {...register("created_by", { required: "Selecione um vendedor" })}>
                                        <option value="">Selecione...</option>
                                        {admins.map((admin: any) => (
                                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                                        ))}
                                    </Select>
                                    {errors.created_by && <ErrorMessage>{errors.created_by.message}</ErrorMessage>}
                                </FormField>

                                <InlineFormField>
                                    <CheckboxContainer alignLeft>
                                        <Checkbox type="checkbox" {...register("has_card")} />
                                        <label>Contém cartão</label>
                                    </CheckboxContainer>
                                    <CheckboxContainer alignLeft>
                                        <Checkbox type="checkbox" {...register("payment_received")} />
                                        <label>Pagamento recebido</label>
                                    </CheckboxContainer>
                                </InlineFormField>

                                {/* Hidden fields - não causam erro de foco com shouldFocusError: false */}
                                <input type="hidden" {...register("products_value")} />
                                <input type="hidden" {...register("discount")} />
                                <input type="hidden" {...register("delivery_fee")} />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <FormHeader>
                                    <FormSubtitle>
                                        Preencha os dados para contato e entrega
                                    </FormSubtitle>
                                </FormHeader>

                                {/* Dados do Cliente */}
                                <SectionCard>
                                    <SectionHeader>
                                        <MaterialIcon className="material-icons" $color="#EC4899">person</MaterialIcon>
                                        <h3>Dados do Cliente</h3>
                                    </SectionHeader>

                                    <FormField>
                                        <Label>Telefone</Label>
                                        <InputMask
                                            autoComplete="off"
                                            mask={mask}
                                            alwaysShowMask={false}
                                            placeholder='(00) 00000-0000'
                                            value={watch("phone_number") || ""}
                                            {...register("phone_number", { 
                                                required: is_delivery ? "Telefone é obrigatório" : false,
                                                validate: (value) => {
                                                    if (is_delivery && value && value.replace(/[^0-9]/g, "").length < 10) {
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
                                            <Input 
                                                type="text" 
                                                autoComplete="off" 
                                                placeholder="Nome"
                                                {...register("first_name", {
                                                    required: is_delivery ? "Nome é obrigatório" : false,
                                                })}
                                                disabled={client_id ? true : false}
                                            />
                                            {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}
                                        </FormField>
                                        <FormField>
                                            <Label>Sobrenome</Label>
                                            <Input 
                                                type="text" 
                                                autoComplete="off" 
                                                placeholder="Sobrenome"
                                                {...register("last_name", {
                                                    required: is_delivery ? "Sobrenome é obrigatório" : false,
                                                })}
                                                disabled={client_id ? true : false}
                                            />
                                            {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                                        </FormField>
                                    </InlineFormField>

                                    <CheckboxContainer alignLeft>
                                        <Checkbox 
                                            type="checkbox"
                                            checked={differentReceiver}
                                            onChange={() => setDiferentReceiver(!differentReceiver)}
                                        />
                                        <label>Pessoa diferente receberá o pedido</label>
                                    </CheckboxContainer>

                                    {differentReceiver && (
                                        <>
                                            <FormField>
                                                <Label>Nome do Destinatário</Label>
                                                <Input 
                                                    type="text" 
                                                    placeholder="Nome de quem vai receber"
                                                    {...register("receiver_name", {
                                                        required: differentReceiver ? "Nome do destinatário é obrigatório" : false,
                                                    })}
                                                />
                                                {errors.receiver_name && <ErrorMessage>{errors.receiver_name.message}</ErrorMessage>}
                                            </FormField>
                                            <FormField>
                                                <Label>Telefone do Destinatário</Label>
                                                <InputMask
                                                    autoComplete="off"
                                                    mask={receiverMask}
                                                    alwaysShowMask={false}
                                                    placeholder='(00) 00000-0000'
                                                    value={watch("receiver_phone") || ""}
                                                    {...register("receiver_phone")}
                                                />
                                            </FormField>
                                        </>
                                    )}
                                </SectionCard>

                                {/* Entrega */}
                                <SectionCard>
                                    <DeliveryToggleContainer>
                                        <DeliveryToggleContent>
                                            <MaterialIcon className="material-icons" $color="#EC4899">local_shipping</MaterialIcon>
                                            <div>
                                                <h3>Entrega</h3>
                                                <p>Ativar para pedidos com entrega</p>
                                            </div>
                                        </DeliveryToggleContent>
                                        <div>
                                            <HiddenCheckbox 
                                                id="delivery-switch" 
                                                type="checkbox" 
                                                checked={is_delivery}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDelivery(e.target.checked)}
                                            />
                                            <DiscountSwitchLabel 
                                                htmlFor="delivery-switch" 
                                                $checked={is_delivery}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </div>
                                    </DeliveryToggleContainer>
                                </SectionCard>

                                {/* Endereço de Entrega */}
                                {is_delivery && (
                                    <>
                                        {addresses.length > 0 && !pickupOnStore && (
                                            <>
                                                <FormField>
                                                    <Label>Endereço Salvo</Label>
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
                                                        }}
                                                    >
                                                        <option value="">Selecione um endereço</option>
                                                        {addresses.map((address: any) => (
                                                            <option key={address.id} value={address.id}>
                                                                {address.street}, {address.street_number} - {address.city}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormField>

                                                <CheckboxContainer alignLeft>
                                                    <Checkbox 
                                                        type="checkbox" 
                                                        disabled={pickupOnStore} 
                                                        onChange={() => {
                                                            setNewAddress(!newAddress);
                                                            if (!newAddress) {
                                                                setAddressId("");
                                                                setValue("addressId", "");
                                                            }
                                                            if (newAddress) {
                                                                setAddressId(selectedAddress.id);
                                                                setValue("addressId", selectedAddress.id);
                                                            }
                                                        }} 
                                                        checked={newAddress}
                                                    />
                                                    <label>Cadastrar novo endereço</label>
                                                </CheckboxContainer>
                                            </>
                                        )}

                                        {(newAddress || addresses.length === 0) && !pickupOnStore && (
                                            <>
                                                <InlineFormField>
                                                    <FormField>
                                                        <Label>CEP</Label>
                                                        <Input 
                                                            type="tel" 
                                                            placeholder="00000-000" 
                                                            {...register("postal_code", {
                                                                required: is_delivery && !pickupOnStore ? "CEP é obrigatório" : false,
                                                            })} 
                                                        />
                                                        {errors.postal_code && <ErrorMessage>{errors.postal_code.message}</ErrorMessage>}
                                                    </FormField>
                                                    <FormField>
                                                        <Label>Rua</Label>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="Nome da rua" 
                                                            {...register("street", {
                                                                required: is_delivery && !pickupOnStore ? "Rua é obrigatória" : false,
                                                            })} 
                                                        />
                                                        {errors.street && <ErrorMessage>{errors.street.message}</ErrorMessage>}
                                                    </FormField>
                                                </InlineFormField>

                                                <InlineFormField>
                                                    <FormField>
                                                        <Label>Número</Label>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="Nº" 
                                                            {...register("street_number", {
                                                                required: is_delivery && !pickupOnStore ? "Número é obrigatório" : false,
                                                            })} 
                                                        />
                                                        {errors.street_number && <ErrorMessage>{errors.street_number.message}</ErrorMessage>}
                                                    </FormField>
                                                    <FormField>
                                                        <Label>Complemento</Label>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="Apto, Bloco..." 
                                                            {...register("complement")} 
                                                        />
                                                    </FormField>
                                                </InlineFormField>
                                                <InlineFormField>
                                                    <FormField>
                                                        <Label>Bairro</Label>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="Bairro" 
                                                            {...register("neighborhood", {
                                                                required: is_delivery && !pickupOnStore ? "Bairro é obrigatório" : false,
                                                            })} 
                                                        />
                                                        {errors.neighborhood && <ErrorMessage>{errors.neighborhood.message}</ErrorMessage>}
                                                    </FormField>
                                                    <FormField>
                                                        <Label>Ponto de referência</Label>
                                                        <Input type="text" placeholder="Ponto de referência" {...register("reference_point")}
                                                            disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                                        />
                                                    </FormField>
                                                </InlineFormField>
                                                

                                                <InlineFormField>
                                                    <FormField>
                                                        <Label>Cidade</Label>
                                                        <Input 
                                                            type="text" 
                                                            placeholder="Cidade" 
                                                            {...register("city", {
                                                                required: is_delivery && !pickupOnStore ? "Cidade é obrigatória" : false,
                                                            })} 
                                                        />
                                                        {errors.city && <ErrorMessage>{errors.city.message}</ErrorMessage>}
                                                    </FormField>
                                                    <FormField>
                                                        <Label>Estado</Label>
                                                        <Select {...register("state", {
                                                            required: is_delivery && !pickupOnStore ? "Estado é obrigatório" : false,
                                                        })}>
                                                            <option value="">UF</option>
                                                            {Object.entries(STATES).map(([key, value]) => (
                                                                <option key={key} value={key}>{value}</option>
                                                            ))}
                                                        </Select>
                                                        {errors.state && <ErrorMessage>{errors.state.message}</ErrorMessage>}
                                                    </FormField>
                                                </InlineFormField>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <FormHeader>
                                    <h2>Resumo do Pedido</h2>
                                    <FormSubtitle>
                                        Confira os detalhes antes de finalizar
                                    </FormSubtitle>
                                </FormHeader>

                                {/* Produtos */}
                                <SummarySection>
                                    <SummarySectionTitle>
                                        <MaterialIcon className="material-icons" $size="1.2rem" $color="#EC4899">shopping_bag</MaterialIcon>
                                        Produtos
                                    </SummarySectionTitle>
                                    {products.map((product, index) => (
                                        <ProductSummaryItem key={index}>
                                            <div>
                                                <ProductSummaryName>{product.name}</ProductSummaryName>
                                                <ProductSummaryQuantity>Qtd: {product.quantity}</ProductSummaryQuantity>
                                            </div>
                                            <ProductSummaryPrice>
                                                R$ {(Number(product.price) * Number(product.quantity)).toFixed(2)}
                                            </ProductSummaryPrice>
                                        </ProductSummaryItem>
                                    ))}
                                </SummarySection>

                                {/* Informações do Cliente */}
                                {(is_delivery || watch('first_name')) && (
                                    <SectionCard>
                                        <SummarySectionTitle>
                                            <MaterialIcon className="material-icons" $size="1.2rem" $color="#EC4899">person</MaterialIcon>
                                            Cliente
                                        </SummarySectionTitle>
                                        <SummaryInfoText>
                                            <div><strong>Nome:</strong> {watch('first_name')} {watch('last_name')}</div>
                                            <div><strong>Telefone:</strong> {watch('phone_number')}</div>
                                            {differentReceiver && (
                                                <>
                                                    <SummaryDivider>
                                                        <strong>Destinatário:</strong> {watch('receiver_name')}
                                                    </SummaryDivider>
                                                    {watch('receiver_phone') && (
                                                        <div><strong>Tel. Destinatário:</strong> {watch('receiver_phone')}</div>
                                                    )}
                                                </>
                                            )}
                                        </SummaryInfoText>
                                    </SectionCard>
                                )}

                                {/* Endereço de Entrega */}
                                {is_delivery && !pickupOnStore && (
                                    <SectionCard>
                                        <SummarySectionTitle>
                                            <MaterialIcon className="material-icons" $size="1.2rem" $color="#EC4899">location_on</MaterialIcon>
                                            Endereço de Entrega
                                        </SummarySectionTitle>
                                        <SummaryInfoText>
                                            <div>{watch('street')}, {watch('street_number')}</div>
                                            {watch('complement') && <div>{watch('complement')}</div>}
                                            <div>{watch('neighborhood')}</div>
                                            <div>Ponto de Referência: {watch('reference_point')}</div>
                                            <div>{watch('city')} - {watch('state')}</div>
                                            <div>CEP: {watch('postal_code')}</div>
                                        </SummaryInfoText>
                                    </SectionCard>
                                )}

                                {/* Detalhes do Pedido */}
                                <SectionCard>
                                    <SummarySectionTitle>
                                        <MaterialIcon className="material-icons" $size="1.2rem" $color="#EC4899">event_note</MaterialIcon>
                                        Detalhes do Pedido
                                    </SummarySectionTitle>
                                    <SummaryInfoText>
                                        <div><strong>Data de Entrega:</strong> {watch('delivery_date') ? new Date(watch('delivery_date')).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'}</div>
                                        <div><strong>Pagamento:</strong> {PAYMENT_METHODS[watch('payment_method') as keyof typeof PAYMENT_METHODS] || '-'}</div>
                                        <div><strong>Status Pagamento:</strong> {watch('payment_received') ? '✓ Recebido' : '✗ Pendente'}</div>
                                        <div><strong>Contém Cartão:</strong> {watch('has_card') ? 'Sim' : 'Não'}</div>
                                        {watch('additional_information') && (
                                            <SummaryDivider>
                                                <strong>Observações:</strong><br />
                                                {watch('additional_information')}
                                            </SummaryDivider>
                                        )}
                                    </SummaryInfoText>
                                </SectionCard>

                                {/* Resumo Financeiro */}
                                <PriceSummary>
                                    <div className="summary-line">
                                        <span>Subtotal:</span>
                                        <span>R$ {Number(productsValue).toFixed(2)}</span>
                                    </div>
                                    <div className="summary-line">
                                        <span>Desconto {isPercentageDiscount ? `(${Number(discountInput).toFixed(2)}%)` : ''}:</span>
                                        <span>- R$ {absoluteDiscount.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-line">
                                        <span>Taxa de Entrega:</span>
                                        <span>R$ {Number(deliveryFee).toFixed(2)}</span>
                                    </div>
                                    <div className="summary-total">
                                        <span>Total:</span>
                                        <span>R$ {totalValue.toFixed(2)}</span>
                                    </div>
                                </PriceSummary>

                                {/* Hidden field for description */}
                                <Input {...register("description", { required: "Selecione um produto" })}
                                    style={{ display: 'none'}} value={description}/>
                            </>
                        )}

                        <ActionButtons>
                            {step > 1 && (
                                <BackButton 
                                    type="button"
                                    onClick={handlePreviousStep}
                                >
                                    Voltar
                                </BackButton>
                            )}
                            {step === 4 && (
                                <PrimaryButton
                                    type="submit"
                                    style={{ marginRight: "20px", backgroundColor: "#f5cb2e", color: "#000" }}
                                    onClick={() => setOrderStatus("OPENED")}
                                >
                                    Gerar Pedido
                                </PrimaryButton>
                            )}
                            <PrimaryButton type="submit" onClick={() => setOrderStatus("DONE")}>
                                {step === 4 ? 'Finalizar Pedido' : 'Continuar'}
                            </PrimaryButton>
                        </ActionButtons>
                    </Form>
                </FormContainer>
            )}
        </Container>
    )
}