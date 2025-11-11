import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import { ProductCard} from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";
import { TooltipModal } from "../../components/Tooltip";
import { Loader } from '../../components/Loader';
import { PAYMENT_METHODS } from "../../constants";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faXmark, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { createOrder, createOrderByAi } from "../../services/orderService";
import { useAdmins } from "../../contexts/AdminsContext";
import { useOrders } from "../../contexts/OrdersContext";
import { ProductModal } from "../../components/ProductModal";
import { rawTelephone } from "../../utils";
import { useProducts } from "../../contexts/ProductsContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
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
    DescriptionArea,
    PageHeader,
    Switch,
    StyledSwitch
} from "../../styles/global";

import {
    Form,
    Container,
    OrderDetail,
    NewOrderContainer,
    ProductList,
    ProductContainer,
    NewProductButton,
    PageHeaderActions,
    DiscountSwitch,
    DiscountSwitchLabel,
    PriceSummary
} from "./style";

import placeholder_products from '../../assets/images/placeholder_products.png';

interface INewOrder {
    id: string;
    description: string;
    additional_information: string;
    has_card: boolean;
    payment_received: boolean;
    delivery_date: string;
    payment_method: string;
    products_value: number;
    discount: number;
    delivery_fee: number;
    total: number;
    created_by: string;
    online_code: string;
    receiver_phone: string;
    order_ai_information: string;
}

interface IProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export function OnlineOrder() {
    const { products: availableProducts, loadAvailableProducts, totalProducts } = useProducts();
    const { showSuccess } = useSuccessMessage();

    const navigate = useNavigate();
    const { admins } = useAdmins();
    const { addOrder } = useOrders();

    const [showLoader, setShowLoader] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [orderLink, setOrderLink] = useState("");
    const mockedDeliveryDate = moment().add(2, "days").format("YYYY-MM-DD");
    const [mask, setMask] = useState("(99) 99999-9999");
    const [copied, setCopied] = useState(false);
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productModal, setProductModal] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [useAIToGenerate, setUseAIToGenerate] = useState(false);
    const [showToolTipModal, setShowToolTipModal] = useState(false);
    const [isPercentageDiscount, setIsPercentageDiscount] = useState(false);
    const tooltipMessage = `
👉 Entregar dia:
👉 Nome do Remetente:
👉 telefone do remetente:
👉🏼 Nome do destinatário:
👉🏼 Telefone do destinatário: 
👉🏼 Endereço:
👉 Bairro:
👉 Número:
👉🏼 Ponto de referência:
👉🏼 Dizer do cartão para ser impresso:`

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<INewOrder>();

    const receiver_phone = watch("receiver_phone");

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

    const handleCopy = () => {
        const message = `Você poderia preencher esse link com o endereço completo prfv? E nele também tem um espacinho para você enviar um cartão. ✉️❤️\n${orderLink}`;

        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    function generateOnlineCode() {
        const numerosAleatorios = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
        const timestamp = Date.now().toString().slice(0, 3);
        return `${numerosAleatorios}${timestamp}`;
    }

    const submitOrder = async (data: INewOrder) => {
        const baseUrl = process.env.REACT_APP_URL;

        setShowLoader(true);

        // Calcula o desconto absoluto para enviar ao backend
        const absoluteDiscountValue = calculateAbsoluteDiscount(Number(data.discount) || 0, Number(data.products_value));

        const orderData = {
            client_id: null,
            receiver_phone: rawTelephone(receiver_phone),
            first_name: "",
            last_name: "",
            receiver_name: "",
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
            payment_method: data.payment_method,
            payment_received: data.payment_received,
            products_value: Number(data.products_value),
            discount: absoluteDiscountValue,
            delivery_fee: Number(data.delivery_fee),
            total: Number(data.products_value) - absoluteDiscountValue + Number(data.delivery_fee),
            status: "WAITING_FOR_CLIENT",
            has_card: false,
            created_by: data.created_by,
            online_order: true,
            online_code: generateOnlineCode(),
            products: products,
            order_ai_information: data.order_ai_information,
        }

        let response;

        if (!useAIToGenerate) {
            const { data: responseData } = await createOrder(orderData);
            response = responseData;
        }

        if (useAIToGenerate) {
            const { data: responseData } = await createOrderByAi(orderData);
            response = responseData;
            addOrder(response);
            setShowLoader(false);
            navigate("/ordensDeServico");
            return;
        }

        if (response.id && !useAIToGenerate) {
            setShowOrderDetail(true);
            setOrderLink(`${baseUrl}completarPedido/${response.id}`);
        }

        addOrder(response);
        showSuccess("Pedido online criado com sucesso!");

        setShowLoader(false);
    }

    useEffect(() => {
        const receiver_phone = watch("receiver_phone") || "";
        const numericValue = rawTelephone(receiver_phone);
    
        const timeout = setTimeout(() => {
            if (numericValue.length === 10) {
                setMask("(99) 9999-9999");
            } else {
                setMask("(99) 99999-9999");
            }
        }, 800);

        return () => clearTimeout(timeout);
    }, [receiver_phone, watch, setMask]);

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

            setValue("products_value", total);
            return updated;
        });
    };

    const removeProduct = (product: any) => {
        setProducts((prev: any) => {
            const updated = prev.filter((p: any) => p.id !== product.id);
        
            const total = updated.reduce((sum: any, p: any) => {
                return sum + Number(p.quantity) * Number(p.price);
            }, 0);
        
            setValue("products_value", total);
        
            return updated;
        });
    };

    function handleOpenProductModal(product: any){
        setProductModal(true)
    }
    function handleCloseProductModal(){
        setProductModal(false)
    }

    const description = products
        .map((p) => `${p.quantity}x ${p.name} - R$ ${p.price}`)
        .join('\n');

    useEffect(() => {
        setValue('description', description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [description]);

    useEffect(() => {
        loadAvailableProducts(page, pageSize, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, query]);

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

        handleResize();
    }, []);

    return (
        <Container>
            <TooltipModal
                isOpen={showToolTipModal}
                onRequestClose={() => setShowToolTipModal(false)}
                textContent={tooltipMessage}
                title="Utilize o modelo abaixo, se atente a questão da Cidade e do Estado caso não seja Itaperuna."
                showWhatsapp={false}
                showCopyButton={true}
            />
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
                            <button
                                type="button"
                                onClick={handleCopy}
                                style={{
                                    padding: "4px 8px",
                                    backgroundColor: "#e7b7c2",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    color: 'white',
                                    fontSize: '15px'
                                }}
                            >
                                Copiar link
                            </button>
                            {copied && (
                                <span style={{ color: "gray", fontWeight: "300", marginLeft: '10px' }}>
                                    Link copiado!
                                </span>
                            )}
                        </div>
                    </div>
                </OrderDetail>
            }
            <Loader show={showLoader} />
            {!showOrderDetail &&
                <NewOrderContainer>
                    <ProductContainer>
                        <PageHeader>
                            <div className="title">
                                <FontAwesomeIcon icon={faWhatsapp as any} />
                                <span>Pedido Online</span>
                            </div>
                            <PageHeaderActions>
                                <Switch>
                                    <span style={{ color: useAIToGenerate ? "#333" : "#EC4899" }}>
                                        <i className="material-icons">link</i>
                                        Pedido via Link
                                    </span>
                                    <Input id="switch" type="checkbox" placeholder='Ativo'
                                        onChange={(e: any) => setUseAIToGenerate(e.target.checked)}/>
                                    <StyledSwitch htmlFor="switch" $checked={useAIToGenerate as boolean} />
                                    <span style={{ color: useAIToGenerate ? "#EC4899" : "#333" }}>
                                        <i className="material-icons">smart_toy</i>
                                        Pedido via IA
                                    </span>
                                </Switch>
                                <NewProductButton type="button" onClick={handleOpenProductModal}>
                                    Novo Produto
                                </NewProductButton>
                            </PageHeaderActions>
                        </PageHeader>
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
                    <Form onSubmit={handleSubmit(submitOrder)}>
                        <FormField>
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
                            <Input {...register("description", { required: "Descrição obrigatória" })}
                                style={{ display: 'none'}} value={watch("description")}/>

                            {errors.description && (
                                <ErrorMessage>{errors.description.message}</ErrorMessage>
                            )}
                        </FormField>
                        {!useAIToGenerate &&
                            <>
                                <FormField>
                                    <Label>Observações</Label>
                                    <Textarea style={{ minHeight: "100px" }} placeholder="Observações" {...register("additional_information")}
                                    />
                                </FormField>
                                <FormField>
                                    <Label>
                                        Telefone do cliente
                                        <span>*</span>
                                    </Label>
                                    <InputMask
                                        autoComplete="off"
                                        mask={mask}
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
                                <InlineFormField style={{ alignItems: "center" }}>
                                    <FormField style={{ marginRight: "20px" }}>
                                        <Label>
                                            Método de pagamento
                                            <span>*</span>
                                        </Label>
                                        <Select {...register("payment_method", { required: "Método de pagamento inválido" })}>
                                            <option value="">Selecione um método</option>
                                            {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </Select>
                                        {errors.payment_method && <ErrorMessage>{errors.payment_method.message}</ErrorMessage>}
                                    </FormField>
                                    <FormField>
                                        <CheckboxContainer>
                                            <Checkbox type="checkbox" {...register("payment_received")} />
                                            <Label>Pagamento Recebido</Label>
                                        </CheckboxContainer>
                                    </FormField>
                                </InlineFormField>
                                <FormField>
                                    <Label>Vendedor Responsável</Label>
                                    <Select {...register("created_by", { required: "Vendedor Responsável inválido" })}>
                                        <option value="">Selecione um Vendedor</option>
                                        {admins.map((admin: any) => (
                                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                                        ))}
                                    </Select>
                                    {errors.created_by && <ErrorMessage>{errors.created_by.message}</ErrorMessage>}
                                </FormField>
                                <InlineFormField>
                                    <FormField>
                                        <Label>Total dos Produtos</Label>
                                        <Input type="number" step="0.01" placeholder="Total" value={watch("products_value")}
                                            {...register("products_value", {
                                                required: "Valor total é obrigatório",
                                            })}
                                        />
                                        {errors.products_value && <ErrorMessage>{errors.products_value.message}</ErrorMessage>}
                                    </FormField>
                                    <FormField>
                                        <Label>Desconto</Label>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
                                            placeholder={isPercentageDiscount ? "0.00%" : "0.00"} 
                                            defaultValue={0}
                                            {...register("discount")} 
                                        />
                                    </FormField>
                                    <FormField>
                                        <Label>Taxa de entrega</Label>
                                        <Input type="number" step="0.01" placeholder="0.00" {...register("delivery_fee", {
                                        })} />
                                    </FormField>
                                </InlineFormField>
                                <DiscountSwitch>
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

                        {useAIToGenerate &&
                            <>
                                <FormField>
                                    <Label>Observações</Label>
                                    <Textarea style={{ minHeight: "50px" }} placeholder="Observações" {...register("additional_information")}
                                    />
                                </FormField>
                                <InlineFormField style={{ alignItems: "center" }}>
                                    <FormField style={{ marginRight: "20px" }}>
                                        <Label>
                                            Método de pagamento
                                            <span>*</span>
                                        </Label>
                                        <Select {...register("payment_method", { required: "Método de pagamento inválido" })}>
                                            <option value="">Selecione um método</option>
                                            {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </Select>
                                        {errors.payment_method && <ErrorMessage>{errors.payment_method.message}</ErrorMessage>}
                                    </FormField>
                                    <FormField>
                                        <CheckboxContainer>
                                            <Checkbox type="checkbox" {...register("payment_received")} />
                                            <Label>Pagamento Recebido</Label>
                                        </CheckboxContainer>
                                    </FormField>
                                </InlineFormField>
                                <FormField>
                                    <Label>Vendedor Responsável</Label>
                                    <Select {...register("created_by", { required: "Vendedor Responsável inválido" })}>
                                        <option value="">Selecione um Vendedor</option>
                                        {admins.map((admin: any) => (
                                            <option key={admin.id} value={admin.id}>{admin.name}</option>
                                        ))}
                                    </Select>
                                    {errors.created_by && <ErrorMessage>{errors.created_by.message}</ErrorMessage>}
                                </FormField>
                                <InlineFormField>
                                    <FormField>
                                        <Label>Total dos Produtos</Label>
                                        <Input type="number" step="0.01" placeholder="Total" value={watch("products_value")}
                                            {...register("products_value", {
                                                required: "Valor total é obrigatório",
                                            })}
                                        />
                                        {errors.products_value && <ErrorMessage>{errors.products_value.message}</ErrorMessage>}
                                    </FormField>
                                    <FormField>
                                        <Label>Desconto</Label>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
                                            placeholder={isPercentageDiscount ? "0.00%" : "0.00"} 
                                            defaultValue={0}
                                            {...register("discount")} 
                                        />
                                    </FormField>
                                    <FormField>
                                        <Label>Taxa de entrega</Label>
                                        <Input type="number" step="0.01" placeholder="0.00" {...register("delivery_fee", {
                                        })} />
                                    </FormField>
                                </InlineFormField>
                                <DiscountSwitch>
                                    <span style={{ color: isPercentageDiscount ? "#5B5B5B" : "#EC4899" }}>R$</span>
                                    <Input 
                                        id="discount-switch-ai" 
                                        type="checkbox" 
                                        checked={isPercentageDiscount}
                                        onChange={(e) => setIsPercentageDiscount(e.target.checked)}
                                    />
                                    <DiscountSwitchLabel htmlFor="discount-switch-ai" $checked={isPercentageDiscount} />
                                    <span style={{ color: isPercentageDiscount ? "#EC4899" : "#5B5B5B" }}>%</span>
                                </DiscountSwitch>
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

                                <FormField>
                                    <Label>
                                        <div>
                                            Infomações do Cliente
                                            <span>*</span>
                                        </div>

                                        <button
                                            style={{ left: "0px", right: "50px" }}
                                            type="button"
                                            className="label-question"
                                            onClick={() => setShowToolTipModal(!showToolTipModal)}>
                                            <FontAwesomeIcon icon={faCircleQuestion} />
                                        </button>
                                    </Label>
                                    <Textarea
                                        style={{ minHeight: "150px" }}
                                        placeholder="Infomações do Cliente"
                                        {...register("order_ai_information")}
                                    />
                                </FormField>
                            </>
                        }
                        
                        <PrimaryButton type="submit">Finalizar Pedido</PrimaryButton>
                    </Form>
                </NewOrderContainer>
            }
        </Container>
    );
}
