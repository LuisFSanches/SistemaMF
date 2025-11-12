import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faQrcode } from "@fortawesome/free-solid-svg-icons";
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
    OrderSummary,
    NewOrderContainer,
    ProductContainer,
    NewProductButton,
    ProductList,
    FormContainer,
    PageHeaderActions,
    SwitchDetail,
    DiscountSwitch,
    DiscountSwitchLabel,
    PriceSummary
} from "./style";

import {
    FormField,
    Label,
    Input,
    Select,
    Textarea,
    InlineFormField,
    PrimaryButton,
    DescriptionArea,
    PageHeader,
    Switch,
    StyledSwitch
} from "../../styles/global";

import { NewOrderProgressBar } from "../../components/NewOrderProgressBar";
import { ProductModal } from "../../components/ProductModal";
import { CompletedOrderModal } from "../../components/CompletedOrderModal";
import { Loader } from '../../components/Loader';
import { getClientByPhone } from "../../services/clientService";
import { getClientAddresses } from "../../services/addressService";
import { createOrder } from "../../services/orderService";
import { getPickupAddress } from "../../services/addressService";
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
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export function OnStoreOrder() {
    const { addOrder } = useOrders();
    const { admins } = useAdmins();
    const { products: availableProducts, loadAvailableProducts, totalProducts } = useProducts();
    const { showSuccess } = useSuccessMessage();

    const formRef = useRef<HTMLDivElement>(null);
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
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [steps, setSteps] = useState(["Pedido", "Endereço", "Resumo"]);
    const [is_delivery, setIsDelivery] = useState(false);
    const [fillClientInformation, setFillClientInformation] = useState(false);
    const [orderStatus, setOrderStatus] = useState<"OPENED" | "DONE">("OPENED");
    const [showCompletedModal, setShowCompletedModal] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const [orderCode, setOrderCode] = useState("");
    const [showQRScanner, setShowQRScanner] = useState(false);
    const [showProductConfirm, setShowProductConfirm] = useState(false);
    const [scannedProduct, setScannedProduct] = useState<any>(null);
    const [isPercentageDiscount, setIsPercentageDiscount] = useState(false);

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
        if (step === 1 && is_delivery === false) {
            setStep((prevStep) => prevStep + 2);
        }
        if (step < 4 && is_delivery === true) {
            setStep((prevStep) => prevStep + 1);
        }
    }

    const handlePreviousStep = () => {
        if (step > 1 && is_delivery === false) {
            setStep((prevStep) => prevStep - 2);
        } else {
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
        }
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

        // Calcula o desconto absoluto para enviar ao backend
        const absoluteDiscountValue = calculateAbsoluteDiscount(Number(discount) || 0, Number(products_value));
        const total = Number(products_value) - absoluteDiscountValue + Number(delivery_fee);

        const orderData = {
            phone_number: (is_delivery === false && fillClientInformation === false)
                ? "" : rawTelephone(phone_number),
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

        if (step === 2 || (step === 1 && is_delivery === false)) {
            setOrder(orderData);
        }

        if (step === 3 || (step === 3 && is_delivery === false)) {
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
                navigate("/ordensDeServico");
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

            if (phoneNumber && phoneNumber.length >= 10) {
                try {
                    const response = await getClientByPhone(phoneNumber);
                    const { data: client } = response;

                    if (!client) {
                        setClientId("");
                        setAddresses([]);
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
                const newQuantity = existing.quantity + quantity;

                // Recalcula o preço médio ponderado
                const newPrice = (
                    (existing.quantity * existing.price + quantity * price) /
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

    function handleOpenProductModal(product: any){
        setProductModal(true)
    }
    function handleCloseProductModal(){
        setProductModal(false)
    }

    function handleSetFillClientInformation() {
        setFillClientInformation(!fillClientInformation);

        if (fillClientInformation) {
            setValue("first_name", "");
            setValue("last_name", "");
            setValue("phone_number", "");
        }
    }

    const handleQRCodeScan = async (decodedText: string) => {
        try {
            setShowLoader(true);
            // Assume que o QR Code contém o ID do produto
            const { data: product } = await getProductById(decodedText);
            
            if (product) {
                // Armazena o produto e abre o modal de confirmação
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

    const handleConfirmProduct = (quantity: number, price: number) => {
        if (scannedProduct) {
            handleAddProduct(
                {
                    id: scannedProduct.id,
                    name: scannedProduct.name,
                    price: price,
                    quantity: quantity
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
        setShowLoader(true);
        setTimeout(() => {
            loadAvailableProducts(page, pageSize, query).then(() => {
                setShowLoader(false);
            });
        }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query]);

    useEffect(() => {
        if (is_delivery) {
            setSteps(["Pedido", "Endereço", "Resumo"]);
            setValue("delivery_date", "");
            setPickupOnStore(false);
            setValue("payment_received", false);
        } else {
            setSteps(["Pedido", "Resumo"]);
            setValue("first_name", "");
            setValue("last_name", "");
            setValue("phone_number", "");
            setValue("delivery_date", today);
            setPickupOnStore(true);
            setValue("payment_received", true);
            setStep(1);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_delivery]);

    useEffect(() => {
        function handleResize() {
            const width = window.innerWidth;
            if (width < 800) {
                setPageSize(1);
            } else if (width < 1300) {
                setPageSize(4);
            } 
            else if (width < 1600) {
                setPageSize(6);
            }
            else if (width < 1830) {
                setPageSize(8);
            } else {
                setPageSize(10);
            }
        }

        // Executa ao montar
        handleResize();
    }, []);
    
    return(
        <Container>
            <ProductModal 
                isOpen={productModal}
                onRequestClose={handleCloseProductModal}
                loadData={() => {}}
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
            <NewOrderContainer>
                <ProductContainer>
                    <PageHeader style={{ marginBottom: '5px' }}>
                        <div className="title">
                            <FontAwesomeIcon icon={faComputer as any} />
                            <span>Pedido Balcão</span>

                            <NewProductButton type="button" onClick={() => setShowQRScanner(true)}
                                style={{ marginLeft: '20px' }}>
                                <FontAwesomeIcon icon={faQrcode as any} style={{ marginRight: '5px' }} />
                                Escanear Produto
                            </NewProductButton>
                        </div>
                        <PageHeaderActions>
                            <Switch>
                                <span style={{ color: is_delivery ? "#333" : "#EC4899" }}>
                                    <i className="material-icons">storefront</i>
                                    Pedido na Loja
                                </span>
                                <Input id="switch" type="checkbox" placeholder='Ativo'
                                    onChange={(e: any) => setIsDelivery(e.target.checked)}/>
                                <StyledSwitch htmlFor="switch" $checked={is_delivery as boolean} />
                                <span style={{ color: is_delivery ? "#EC4899" : "#333" }}>
                                    <i className="material-icons">moped_package</i>
                                    Entrega
                                </span>
                            </Switch>
                            <NewProductButton type="button" onClick={handleOpenProductModal}>
                                Novo Produto
                            </NewProductButton>
                        </PageHeaderActions>
                    </PageHeader>
                    <SwitchDetail>
                        {is_delivery ? "Pedido para entrega" : "Será Retirado na Loja"}
                    </SwitchDetail>
                    <div className="product-data">
                        <div style={{ position: 'relative', width: '100%' }}>
                            <Input
                                placeholder="Buscar Produtos"
                                onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                        handleSearchProducts(e.target.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
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
            </NewOrderContainer>
            <FormContainer>
                <Form onSubmit={handleSubmit(onSubmitStep)} step={step} autoComplete="off">
                    <FormHeader>
                        <NewOrderProgressBar steps={steps} currentStep={step}/>
                    </FormHeader>
                    {step === 1 &&
                        <>
                            <FormField style={{ marginTop: '0px' }}>
                                <Label>Produtos</Label>
                                <DescriptionArea>
                                    {products.map((p, index) => (
                                        <p key={index}>
                                            {p.quantity}x {p.name} - R$ {p.price}
                                            <button type="button" onClick={() => removeProduct(p)}>
                                                <FontAwesomeIcon icon={faXmark}/>
                                            </button>
                                        </p>
                                    ))}
                                </DescriptionArea>
                                <Input {...register("description", { required: "Selecione um produto" })}
                                    style={{ display: 'none'}} value={watch("description")}/>

                                {errors.description && (
                                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                                )}
                            </FormField>
                            <FormField style={{ marginTop: '5px' }}>
                                <Label>Observações</Label>
                                <Textarea
                                    style={{ minHeight: '70px' }}
                                    placeholder="Observações"
                                    {...register("additional_information")}
                                />
                            </FormField>
                            {is_delivery === false &&
                                <InlineFormField>
                                    <CheckboxContainer style={{ marginTop: '10px' }}>
                                        <Checkbox type="checkbox"
                                            onChange={() => handleSetFillClientInformation()} checked={fillClientInformation}/>
                                        <Label>Preencher dados do cliente</Label>
                                    </CheckboxContainer>
                                </InlineFormField>
                            }
                            {(fillClientInformation || is_delivery) &&
                                <>
                                    <FormField style={{ marginTop: '10px' }}>
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
                                    <InlineFormField style={{ marginTop: '0px' }}>
                                        <FormField style={{ marginTop: '10px' }}>
                                            <Label>Nome Cliente</Label>
                                            <Input type="text" autoComplete="off" placeholder="Nome do Cliente"
                                                {...register("first_name", {
                                                    required: "Nome inválido",
                                                })}
                                                disabled={client_id ? true : false}
                                            />
                                            {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}
                                        </FormField>
                                        <FormField style={{ marginTop: '10px' }}>
                                            <Label>Sobrenome Cliente</Label>
                                            <Input type="text" placeholder="Sobrenome do Cliente" 
                                                {...register("last_name", {
                                                    required: "Sobrenome inválido",
                                                })}
                                                disabled={client_id ? true : false}
                                            />
                                            {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                                        </FormField>
                                    </InlineFormField>
                                </>
                            }
                            {is_delivery &&
                                <InlineFormField>
                                    <CheckboxContainer style={{ marginTop: '10px' }}>
                                        <Checkbox type="checkbox"
                                            onChange={() => setDiferentReceiver(!differentReceiver)} checked={differentReceiver}/>
                                        <Label>Pessoa diferente recebe</Label>
                                    </CheckboxContainer>
                                
                                </InlineFormField>
                            }
                            
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
                                            })}
                                        />
                                        {errors.receiver_phone && <ErrorMessage>{errors.receiver_phone.message}</ErrorMessage>}
                                    </FormField>
                                </InlineFormField>
                            }

                            <FormField style={{ marginTop: '5px' }}>
                                <Label>Vendedor Responsável:</Label>
                                <Select {...register("created_by", { required: "Vendedor Responsável inválido" })}>
                                    <option value="">Pedido Anotado por:</option>
                                    {admins.map((admin: any) => (
                                        <option key={admin.id} value={admin.id}>{admin.name}</option>
                                    ))}
                                </Select>
                                {errors.created_by && <ErrorMessage>{errors.created_by.message}</ErrorMessage>}
                            </FormField>
                            <InlineFormField>
                                <FormField>
                                    <CheckboxContainer style={{ margin: '0px' }}>
                                        <Checkbox type="checkbox" {...register("has_card")} />
                                        <Label>Pedido Contém Cartão</Label>
                                    </CheckboxContainer>
                                </FormField>
                                <FormField>
                                    <CheckboxContainer style={{ margin: '0px' }}>
                                        <Checkbox
                                            type="checkbox" {...register("payment_received")} />
                                        <Label>Pagamento Recebido</Label>
                                    </CheckboxContainer>
                                </FormField>
                            </InlineFormField>
                            
                            <InlineFormField>
                                <FormField style={{ marginTop: '10px' }}>
                                    <Label>Data de Entrega</Label>
                                    <Input type="date" {...register("delivery_date", {
                                        required: "Data de entrega é obrigatória",
                                    })}/>
                                    {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                                </FormField>
                                <FormField style={{ marginTop: '10px' }}>
                                    <Label>Método de pagamento</Label>
                                    <Select {...register("payment_method")}>
                                        {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </Select>
                                </FormField> 
                            </InlineFormField>
                            <FormField>
                                <Label>Tipo de Desconto</Label>
                                <DiscountSwitch>
                                    <span style={{ color: isPercentageDiscount ? "#5B5B5B" : "#EC4899" }}>Valor(R$)</span>
                                    <Input 
                                        id="discount-switch-store" 
                                        type="checkbox" 
                                        checked={isPercentageDiscount}
                                        onChange={(e) => setIsPercentageDiscount(e.target.checked)}
                                    />
                                    <DiscountSwitchLabel htmlFor="discount-switch-store" $checked={isPercentageDiscount} />
                                    <span style={{ color: isPercentageDiscount ? "#EC4899" : "#5B5B5B" }}>Percentual(%)</span>
                                </DiscountSwitch>
                            </FormField>

                            <InlineFormField>
                                <FormField style={{ marginTop: '10px' }}>
                                    <Label>Total dos Produtos</Label>
                                    <Input type="number" step="0.01" placeholder="Total" {...register("products_value", {
                                        required: "Valor total é obrigatório",
                                    })} />
                                    {errors.products_value && <ErrorMessage>{errors.products_value.message}</ErrorMessage>}
                                </FormField>
                                <FormField style={{ marginTop: '10px' }}>
                                    <Label>Desconto</Label>
                                    <Input 
                                        type="number" 
                                        step="0.01" 
                                        placeholder={isPercentageDiscount ? "0.00%" : "0.00"} 
                                        defaultValue={0} 
                                        {...register("discount")} 
                                    />
                                </FormField>
                                <FormField style={{ marginTop: '10px' }}>
                                    <Label>Taxa de entrega</Label>
                                    <Input type="number" step="0.01" placeholder="0.00" {...register("delivery_fee", {
                                    })} />
                                </FormField>
                            </InlineFormField>
                            <PriceSummary>
                                <div className="summary-line">
                                    <span>Subtotal (Produtos):</span>
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
                        </>
                    }

                    {step === 2 &&
                        <>
                            {addresses.length === 0 &&
                                <CheckboxContainer alignLeft>
                                    <Checkbox type="checkbox" onChange={(e) => {
                                        setPickupOnStore(!pickupOnStore)
                                        handlePickUpAddress(e.target.checked);
                                        
                                    }} checked={pickupOnStore}/>
                                    <Label>Retirar no local</Label>
                                </CheckboxContainer>
                            }
                            {addresses.length > 0 && (
                                <>
                                    {!pickupOnStore &&
                                        <FormField>
                                            <Label>Selecione o Endereço</Label>
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
                                            <Label>Retirar no local</Label>
                                        </CheckboxContainer>
                                    </InlineFormField>
                                </>
                            )}
                            {!pickupOnStore &&
                                <>
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

                                    <Label>Bairro</Label>
                                    
                                            <Input type="text" placeholder="Bairro" {...register("neighborhood", {
                                                required: "Bairro inválido",
                                                })}
                                                disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                            />
                                            {errors.neighborhood && <ErrorMessage>{errors.neighborhood.message}</ErrorMessage>}
                                        
                                    </FormField>
                                    <InlineFormField>
                                        <FormField>
                                            
                                            <Label>Ponto de referência</Label>
                                            <Input type="text" placeholder="Ponto de referência" {...register("reference_point")}
                                                disabled={(addresses.length > 0 && !newAddress) ? true : false}
                                            />
                                        
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
                                            <Select {...register("state", {
                                                required: "Estado inválido",
                                            })}>
                                            <option value="">Selecionar:</option>
                                                {Object.entries(STATES).map(([key, value]) => (
                                                    <option key={key} value={key}>{value}</option>
                                                ))}
                                            </Select>
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
                        </>
                    }

                    {step === 3 &&
                        <OrderSummary ref={formRef}>
                            <h2>Resumo do Pedido</h2>
                            <div>
                                <p>Realizado em {new Date().toLocaleString()}</p>
                            </div>
                            <div>
                                <p><strong>Descrição do pedido: </strong>{order.description}</p>
                                <p>Observações: {order.additional_information}</p>
                            </div>
                            <div>
                                <p><strong>Valor dos produtos:</strong> R$ {order.products_value}</p>
                                <p><strong>Desconto:</strong> R$ {order.discount.toFixed(2) || 0}</p>
                                <p><strong>Taxa de entrega:</strong> R$ {order.delivery_fee}</p>
                                <p><strong>Total:</strong> 
                                R$ {(Number(order.products_value) - (Number(order.discount) || 0) + Number(order.delivery_fee)).toFixed(2)}</p>
                            </div>
                            <div>
                                <p><strong>Cliente: </strong>{order.first_name}</p>
                            </div>
                            <div>
                                <p><strong>Endereço:</strong></p>
                                {(order.pickup_on_store || !is_delivery) && <p>Retirar na loja</p>}
                                {(!order.pickup_on_store && is_delivery) &&
                                    <>
                                        <p>{order.street}, {order.street_number}</p>
                                        <p>{order.neighborhood}, {order.city}</p>
                                        <p><strong>Ponto de referência: </strong>{order.reference_point}</p>
                                    </>
                                }
                            </div>
                            <div>
                                <p><strong>Entregar para: </strong>
                                    {order.receiver_name ? order.receiver_name : order.first_name}</p>
                                <p><strong>Telefone do Recebedor: </strong>
                                    {order.receiver_name ? order.receiver_phone : order.phone_number}
                                </p>
                            </div>
                            
                            <div>
                                <p><strong>Método de pagamento: </strong>
                                    {PAYMENT_METHODS[order.payment_method as keyof typeof PAYMENT_METHODS]}
                                </p>
                                <p><strong>Status do pagamento: </strong>
                                    {order.payment_received ? "Recebido" : "Pendente"}
                                </p>
                            </div>
                        </OrderSummary>
                    }
                    
                    <ActionButtons>
                        {step > 1 && 
                            <PrimaryButton style={{marginRight: "20px"}} type="button"
                                onClick={handlePreviousStep}>Voltar</PrimaryButton>
                        }
                        {step === 3 && (
                            <PrimaryButton
                                type="submit"
                                style={{ marginRight: "20px", backgroundColor: "#f5cb2e", color: "#000" }}
                                onClick={() => setOrderStatus("OPENED")}
                            >
                                Gerar Pedido
                            </PrimaryButton>
                        )}
                        <PrimaryButton type="submit" style={{margin: "0px"}} onClick={() => setOrderStatus("DONE")}>
                            {step < 3 ? "Continuar" : "Finalizar"}
                        </PrimaryButton>
                    </ActionButtons>
                </Form>
            </FormContainer>
        </Container>
    )
}