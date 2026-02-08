import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import moment from "moment";
import { IOrder } from "../../interfaces/IOrder";
import { useForm } from "react-hook-form";
import {
	ModalContainer,
	Form,
	Input,
	Textarea,
	ErrorMessage,
	Label,
	DescriptionArea,
} from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faReceipt, faBoxOpen, faUser, faWallet, faSave, faPlus, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useOrders } from "../../contexts/OrdersContext";
import { PAYMENT_METHODS, STATUS_LABEL } from "../../constants";
import { updateOrder, updateStatus } from "../../services/orderService";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { searchStoreProducts } from "../../services/storeProductService";
import { getPickupAddress } from "../../services/addressService";
import { Loader } from "../Loader";
import { ConfirmPopUp } from "../ConfirmPopUp";
import { ChangeClientModal } from "../ChangeClientModal";
import { 
    ModernModalHeader,
    STATUS_COLORS,
    Section, 
    SectionHeader, 
    ProductCard, 
    AddProductButton,
    GridRow,
    ValueCard,
    SelectWithEmoji,
    CheckboxCard,
    ModalFooter,
    DiscardButton,
    CancelButton,
    SaveButton,
    EditClientButton,
    TabsContainer,
    Tab,
    TabContent
} from "./style";

interface IEditOrderModal{
	isOpen: boolean;
    onRequestClose: ()=> void;
    order: IOrder;
}

export function EditOrderModal({
    isOpen,
    onRequestClose,
    order
}:IEditOrderModal){
    const { loadAvailableOrders, editOrder } = useOrders();
	const { showSuccess } = useSuccessMessage();

	const [editAddress, setEditAddress] = useState(false);
	const [pickupAddress, setPickupAddress] = useState(order?.pickup_on_store);
	const [isChangeClientModalOpen, setIsChangeClientModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
    const {
        register,
        handleSubmit,
        setValue,
		watch,
        formState: { errors },
    } = useForm<IOrder>();
	const [showLoader, setShowLoader] = useState(false);
	const [products, setProducts] = useState<any[]>([]);
	const [productSuggestions, setProductSuggestions] = useState<Record<number, any[]>>({});
	const [showSuggestions, setShowSuggestions] = useState<Record<number, boolean>>({});	
	const [queries, setQueries] = useState<{ [key: number]: string }>({});
	const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
	const productRefs = useRef<Record<number, HTMLDivElement | null>>({});
	const [showProductError, setShowProductError] = useState(false);
	const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

	const handleOrder = async (formData: IOrder) => {
		setShowLoader(true);

		const data = {
            id: order.id,
			code: order.code,
			description: formData.description,
			additional_information: formData.additional_information,
			client_id: order.client_id,
			client_address_id: order.client_address_id,
			receiver_name: formData.receiver_name,
			receiver_phone: formData.receiver_phone,
			products_value: Number(formData.products_value),
			discount: Number(formData.discount) || 0,
			delivery_fee: Number(formData.delivery_fee),
			total: Number(formData.products_value) - (Number(formData.discount) || 0) + Number(formData.delivery_fee),
			payment_method: formData.payment_method,
			payment_received: formData.payment_received,
			delivery_date: new Date(`${formData.delivery_date}T00:00:00Z`),
			status: formData.status,
			has_card: formData.has_card,
			pickup_on_store: pickupAddress,
            editAddress,
			clientAddress: {
				id: order.clientAddress.id,
				postal_code: formData.clientAddress.postal_code,
				street: formData.clientAddress.street,
				street_number: formData.clientAddress.street_number,
				complement: formData.clientAddress.complement,
				reference_point: formData.clientAddress.reference_point,
				neighborhood: formData.clientAddress.neighborhood,
				city: formData.clientAddress.city,
				state: formData.clientAddress.state,
				country: formData.clientAddress.country
			},
			products,
			is_delivery: order.is_delivery
        }

		const { data: orderData } = await updateOrder(data);

		editOrder(orderData);
		loadAvailableOrders(1, 25, '');
		showSuccess("Pedido atualizado com sucesso!");
		setEditAddress(false);
		setShowLoader(false);
		onRequestClose();
	}

	const handleCancelOrder = async () => {
		setShowLoader(true);
		
		try {
			const response = await updateStatus({
				id: order.id,
				status: 'CANCELED'
			});
			const { data: orderData } = response;
			editOrder(orderData);

			loadAvailableOrders(1, 25, '');
			setIsConfirmCancelOpen(false);
			setShowLoader(false);
			onRequestClose();
		} catch (error) {
			console.error('Erro ao cancelar pedido:', error);
			setShowLoader(false);
		}
	}

	useEffect(() => {
		if (!order) return;

        setValue("description", order.description);
		setValue("additional_information",
			order.additional_information === "" ? "-" : order.additional_information);
		setValue("client.first_name", order.client.first_name);
		setValue("client.last_name", order.client.last_name);
		setValue("client.phone_number", order.client.phone_number);
		setValue("receiver_name", order.receiver_name);
		setValue("receiver_phone", order.receiver_phone);
		setValue("products_value", order.products_value);
		setValue("discount", order.discount || 0);
		setValue("delivery_fee", order.delivery_fee);
		setValue("total", order.total);
		setValue("payment_method", order.payment_method);
		setValue("payment_received", order.payment_received);
		setValue("status", order.status);
		const formattedDate = moment(order.delivery_date).format("YYYY-MM-DD");
    	setValue("delivery_date", formattedDate);
		setValue("has_card", order.has_card);
		setValue("clientAddress.postal_code", order.clientAddress.postal_code);
		setValue("clientAddress.street", order.clientAddress.street);
		setValue("clientAddress.street_number", order.clientAddress.street_number);
		setValue("clientAddress.complement", order.clientAddress.complement);
		setValue("clientAddress.neighborhood", order.clientAddress.neighborhood);
		setValue("clientAddress.reference_point", order.clientAddress.reference_point);
		setValue("clientAddress.city", order.clientAddress.city);
		setValue("clientAddress.state", order.clientAddress.state);
		setValue("clientAddress.country", order.clientAddress.country);
		setValue("pickup_on_store", order.pickup_on_store);
		setPickupAddress(order.pickup_on_store);
		setProducts(order.orderItems);
    }, [order, setValue]);

	useEffect(() => {
		setValue("total", Number(watch("products_value")) - (Number(watch("discount")) || 0) + Number(watch("delivery_fee")));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("products_value"), watch("discount"), watch("delivery_fee")]);

	const handlePickUpAddress = async (value: boolean) => {
        if (value) {
            const { data: pickUpAddress } = await getPickupAddress() as any;
            setValue("client_address_id", pickUpAddress.id);
            setValue("pickup_on_store", true);
			setPickupAddress(true);
        }

        if (!value) {
            setValue("client_address_id", order.client_address_id);
            setValue("pickup_on_store", false);
			setPickupAddress(false);
        }
    }

	const handleSelectClient = (client: any) => {
		setValue("client.first_name", client.first_name);
		setValue("client.last_name", client.last_name);
		setValue("client.phone_number", client.phone_number);
		order.client_id = client.id;
	};

	const updateProducts = (index: number, param: string, value: any) => {
		setProducts((prev: any[]) => {
			const updated = [...prev];
				updated[index] = {
				...updated[index],
				[param]: value,
			};
		
			const total = updated.reduce((sum, p) => {
				return sum + Number(p.quantity) * Number(p.price);
			}, 0);
		
			setValue("products_value", total);
		
			return updated;
		});
	};

	const handleSearchProducts = async (index: number, text: string) => {
		setQueries(prev => ({ ...prev, [index]: text }));
	
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}
	
		debounceTimeout.current = setTimeout(async () => {
			if (text.length >= 2) {
				const response = await searchStoreProducts(text);
	
				setProductSuggestions(prev => ({
					...prev,
					[index]: response.data,
				}));
	
				setShowSuggestions(prev => ({
					...prev,
					[index]: true,
				}));
			}
		}, 700);
	};
	

	const handleSelectProduct = (index: number, product: any) => {
		// Constrói a estrutura storeProduct correta
		const storeProductStructure = {
			id: product.id,
			price: product.price,
			stock: product.stock,
			enabled: product.enabled,
			visible_for_online_store: product.visible_for_online_store,
			store_id: product.store_id,
			product_id: product.product_id,
			created_at: product.created_at,
			updated_at: product.updated_at,
			product: {
				name: product.name,
				image: product.image
			}
		};

		updateProducts(index, "storeProduct", storeProductStructure);
		updateProducts(index, "price", product.price);
		updateProducts(index, "store_product_id", product.id);
		updateProducts(index, "product_id", null);
		updateProducts(index, "store_id", product.store_id);
		setShowSuggestions({});

		// Atualiza o texto do input também
		setQueries(prev => ({ ...prev, [index]: product.name }));
	};

	const addProduct = () => {
		setProducts((prev: any[]) => [
			...prev,
			{
				id: null,
				order_id: order.id,
				product_id: null,
				store_product_id: "",
				store_id: "",
				quantity: 1,
				price: 0,
				storeProduct: {
					id: "",
					product_id: "",
					store_id: "",
					price: 0,
					stock: 0,
					enabled: true,
					visible_for_online_store: false,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
					product: {
						name: '',
						image: null
					}
				}
			}
		]);
		
		setQueries(prev => ({
			...prev,
			[products.length]: ''
		}));
	};

	const removeProduct = (index: number) => {
		setProducts((prev: any[]) => prev.filter((_, i) => i !== index));
		
		setQueries((prev) => {
			const updated = { ...prev };
			delete updated[index];
			return updated;
		});
	};

	const description = products
			?.map((p) => `${p.quantity}x ${p?.storeProduct?.product?.name} - R$ ${p.price}`)
			.join('\n');
	
	useEffect(() => {
		if (order?.orderItems?.length > 0) {
			setValue('description', description);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [description]);

	useEffect(() => {
		if (products) {
			const hasInvalidProduct = products && products.some(p => {
				return !p.quantity || !p.price;
			});
		
			setShowProductError(hasInvalidProduct );
		}

	}, [products]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			Object.entries(productRefs.current).forEach(([index, ref]) => {
				if (ref && !ref.contains(event.target as Node)) {
					setShowSuggestions(prev => ({
						...prev,
						[Number(index)]: false,
					}));
				}
			});
		};
	
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	if (!order) {
		return null;
	}

    return(
        <Modal 
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content-edit-order"
        >
			<Loader show={showLoader}/>
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark}/>
            </button>

            <ModalContainer>
                <Form onSubmit={handleSubmit(handleOrder)}>
                    <ModernModalHeader statusColor={STATUS_COLORS[order.status]}>
                        <div className="header-content">
                            <div className="header-left">
                                <div className="icon-container">
                                    <FontAwesomeIcon icon={faReceipt} />
                                </div>
                                <div className="header-title">
                                    <h2>Pedido #{order?.code}</h2>
                                    <span className="order-code">Edição de pedido</span>
                                </div>
                            </div>
                            <div className="status-badge">
                                <span>{STATUS_LABEL[order.status]}</span>
                            </div>
                        </div>
                    </ModernModalHeader>

                    {/* Sistema de Abas */}
                    <TabsContainer>
                        <Tab type="button" active={activeTab === 0} onClick={() => setActiveTab(0)}>
                            <FontAwesomeIcon icon={faReceipt} />
                            Detalhes do Pedido
                        </Tab>
                        <Tab type="button" active={activeTab === 1} onClick={() => setActiveTab(1)}>
                            <FontAwesomeIcon icon={faBoxOpen} />
                            Produtos
                        </Tab>
                        <Tab type="button" active={activeTab === 2} onClick={() => setActiveTab(2)}>
                            <FontAwesomeIcon icon={faWallet} />
                            Pagamento e Valores
                        </Tab>
                        <Tab type="button" active={activeTab === 3} onClick={() => setActiveTab(3)}>
                            <FontAwesomeIcon icon={faUser} />
                            Dados do Cliente
                        </Tab>
                        <Tab type="button" active={activeTab === 4} onClick={() => setActiveTab(4)}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            Endereço
                        </Tab>
                    </TabsContainer>

                    {/* Aba 1: Detalhes do Pedido */}
                    <TabContent active={activeTab === 0}>
                        {/* Descrição para pedidos com produtos */}
                        {products?.length > 0 && (
                            <Section>
                                <GridRow>
                                    <div className="grid-container">
                                        <Label>Descrição do Pedido</Label>
                                        <DescriptionArea>
                                            {products?.map((p, index) => (
                                                <p key={index}>
                                                    {p.quantity}x - {p?.storeProduct?.product?.name} - R$ {p.price}
                                                </p>
                                            ))}
                                        </DescriptionArea>
                                    </div>
                                    <div className="grid-container">
                                        <Label>Informações Adicionais</Label>
                                        <Textarea {...register("additional_information")}/>
                                    </div>
                                </GridRow>
                                
                            </Section>
                        )}

                        {/* Descrição para pedidos sem produtos */}
                        {order?.orderItems?.length === 0 && (
                            <Section>
                                <GridRow>
                                    <div className="grid-container">
                                        <Label>Descrição</Label>
                                        <Textarea {...register("description", {required: "Descrição inválida"})}/>
                                        <ErrorMessage>{errors.description?.message}</ErrorMessage>
                                    </div>
                                    <div className="grid-container">
                                        <Label>Informações Adicionais</Label>
                                        <Textarea {...register("additional_information")}/>
                                    </div>
                                </GridRow>
                                
                            </Section>
                        )}
                        
                        {/* Resumo de Valores */}
                        <Section>
                            <GridRow className="price-row">
                                <ValueCard>
                                    <div className="value-label">Subtotal</div>
                                    <div className="value-amount">R$ {Number(watch("products_value") || 0).toFixed(2)}</div>
                                </ValueCard>
                                <ValueCard>
                                    <div className="value-label">Desconto</div>
                                    <div className="value-amount">R$ {Number(watch("discount") || 0).toFixed(2)}</div>
                                </ValueCard>
                                <ValueCard>
                                    <div className="value-label">Taxa de Entrega</div>
                                    <div className="value-amount">R$ {Number(watch("delivery_fee") || 0).toFixed(2)}</div>
                                </ValueCard>
                                <ValueCard highlight>
                                    <div className="value-label">Total</div>
                                    <div className="value-amount">R$ {Number(watch("total") || 0).toFixed(2)}</div>
                                </ValueCard>
                            </GridRow>
                        </Section>

                        {/* Status, Cartão e Retirada na mesma linha */}
                        <Section>
                            <GridRow className="order-information">
                                <div>
                                    <Label>Status do Pedido</Label>
                                    <SelectWithEmoji {...register("status")} as="select">
                                        {Object.entries(STATUS_LABEL).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {key === 'DONE' ? '✅' : key === 'IN_PROGRESS' ? '🔄' : '📋'} {value}
                                            </option>
                                        ))}
                                    </SelectWithEmoji>
                                </div>

                                <CheckboxCard checked={watch("has_card")}>
                                    <div className="checkbox-header">
                                        <input type="checkbox" {...register("has_card")} />
                                        <span className="checkbox-title">💌 Contém Cartão</span>
                                    </div>
                                    <span className="checkbox-description">
                                        Pedido inclui cartão de mensagem
                                    </span>
                                </CheckboxCard>

                                <CheckboxCard checked={pickupAddress}>
                                    <div className="checkbox-header">
                                        <input 
                                            type="checkbox" 
                                            checked={pickupAddress}
                                            onChange={(e) => handlePickUpAddress(e.target.checked)}
                                        />
                                        <span className="checkbox-title">🏪 Retirar no Local</span>
                                    </div>
                                    <span className="checkbox-description">
                                        Cliente irá retirar na loja
                                    </span>
                                </CheckboxCard>
                            </GridRow>
                        </Section>
                    </TabContent>

                    {/* Aba 2: Produtos */}
                    <TabContent active={activeTab === 1}>
                        {/* Seção de Produtos */}
                        {order?.orderItems?.length > 0 && (
                            <Section>
                                <SectionHeader>
                                    <div className="section-icon">
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                    </div>
                                    <h3>Produtos do Pedido</h3>
                                </SectionHeader>
                                
                                {products?.map((p: any, index: number) => (
                                    <ProductCard key={index}>
                                        <div className="product-row">
                                            {p?.storeProduct?.product?.image ? (
                                                <img 
                                                    src={p.storeProduct.product.image} 
                                                    alt={p.storeProduct.product.name}
                                                    className="product-image"
                                                />
                                            ) : (
                                                <div className="product-image-placeholder">
                                                    <FontAwesomeIcon icon={faBoxOpen} />
                                                </div>
                                            )}
                                            
                                            <div
                                                style={{ position: 'relative', width: '100%' }}
                                                ref={(el) => (productRefs.current[index] = el)}
                                            >
                                                <Label>Produto</Label>
                                                <Input
                                                    placeholder="Buscar produto..."
                                                    value={queries[index] ?? p?.storeProduct?.product?.name}
                                                    onChange={(e) => handleSearchProducts(index, e.target.value)}
                                                    onFocus={() => (queries[index] || p?.storeProduct?.product?.name) &&
                                                        setShowSuggestions(prev => ({ ...prev, [index]: true }))}
                                                />

                                                {showSuggestions[index] && productSuggestions[index]?.length > 0 &&
                                                    (queries[index]?.length ?? 0) >= 3 && (
                                                    <ul className="suggestion-box">
                                                        {productSuggestions[index].map((product: any) => (
                                                            <li key={product.id} onClick={() => handleSelectProduct(index, product)}>
                                                                {product.name} - R$ {product.price}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div>
                                                <Label>Quantidade</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={p.quantity}
                                                    onChange={(e) => updateProducts(index, 'quantity', Number(e.target.value))}
                                                />
                                            </div>

                                            <div>
                                                <Label>Valor</Label>
                                                <Input
                                                    placeholder="Valor"
                                                    type="number"
                                                    value={p.price}
                                                    step="0.01"
                                                    onChange={(e) => updateProducts(index, 'price', Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        
                                        <button
                                            type="button"
                                            className="delete-button"
                                            onClick={() => removeProduct(index)}
                                        >
                                            <FontAwesomeIcon icon={faXmark}/>
                                        </button>
                                    </ProductCard>
                                ))}

                                <AddProductButton type="button" onClick={addProduct}>
                                    <FontAwesomeIcon icon={faPlus} />
                                    Adicionar Produto
                                </AddProductButton>
                            </Section>
                        )}
                    </TabContent>

                    {/* Aba 4: Dados do Cliente */}
                    <TabContent active={activeTab === 3}>
                        <Section>
                            <SectionHeader>
                                <div className="section-icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <h3>Cliente e Recebedor</h3>
                            </SectionHeader>

                            <GridRow>
                                <div>
                                    <Label>Nome do Cliente</Label>
                                    <Input {...register("client.first_name", {required: "Nome inválido"})} disabled/>
                                    <EditClientButton type="button" onClick={() => setIsChangeClientModalOpen(true)}>
                                        Alterar Cliente
                                    </EditClientButton>
                                </div>
                                <div>
                                    <Label>Telefone do Cliente</Label>
                                    <Input {...register("client.phone_number", {required: "Telefone inválido"})} disabled/>
                                </div>
                            </GridRow>

                            {(order?.receiver_phone || order?.receiver_name) && (
                                <GridRow style={{ marginTop: '1rem' }}>
                                    <div>
                                        <Label>Nome do Recebedor</Label>
                                        <Input {...register("receiver_name")}/>
                                    </div>
                                    <div>
                                        <Label>Telefone do Recebedor</Label>
                                        <Input {...register("receiver_phone")}/>
                                    </div>
                                </GridRow>
                            )}
                        </Section>
                    </TabContent>

                    {/* Aba 3: Pagamento e Valores */}
                    <TabContent active={activeTab === 2}>
                        <Section>
                            <SectionHeader>
                                <div className="section-icon">
                                    <FontAwesomeIcon icon={faWallet} />
                                </div>
                                <h3>Pagamento e Valores</h3>
                            </SectionHeader>

                            <GridRow className="price-row">
                                <ValueCard>
                                    <div className="value-label">Subtotal</div>
                                    <div className="value-amount">R$ {Number(watch("products_value") || 0).toFixed(2)}</div>
                                </ValueCard>
                                <ValueCard>
                                    <div className="value-label">Desconto</div>
                                    <div className="value-amount">R$ {Number(watch("discount") || 0).toFixed(2)}</div>
                                </ValueCard>
                                <ValueCard>
                                    <div className="value-label">Taxa de Entrega</div>
                                    <div className="value-amount">R$ {Number(watch("delivery_fee") || 0).toFixed(2)}</div>
                                </ValueCard>
                                <ValueCard highlight>
                                    <div className="value-label">Total</div>
                                    <div className="value-amount">R$ {Number(watch("total") || 0).toFixed(2)}</div>
                                </ValueCard>
                            </GridRow>

                            <GridRow style={{ marginBottom: '1rem' }}>
                                <div>
                                    <Label>Valor dos Produtos</Label>
                                    <Input type="number" step="0.01" disabled={products?.length > 0}
                                        {...register("products_value", {required: "Valor Inválido"})}/>
                                    <ErrorMessage>{errors.products_value?.message}</ErrorMessage>
                                </div>
                                <div>
                                    <Label>Desconto</Label>
                                    <Input type="number" step="0.01" {...register("discount")}/>
                                </div>
                            </GridRow>

                            <GridRow style={{ marginBottom: '1rem' }}>
                                <div>
                                    <Label>Taxa de Entrega</Label>
                                    <Input type="number" step="0.01" {...register("delivery_fee", {required: "Valor Inválido"})}/>
                                    <ErrorMessage>{errors.delivery_fee?.message}</ErrorMessage>
                                </div>
                                <div>
                                    <Label>Data de Entrega</Label>
                                    <Input type="date" {...register("delivery_date", {
                                        required: "Data de entrega é obrigatória",
                                    })}/>
                                    {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                                </div>
                            </GridRow>

                            <GridRow style={{ marginBottom: '1rem' }}>
                                <div>
                                    <Label>Método de pagamento</Label>
                                    <SelectWithEmoji {...register("payment_method")} as="select">
                                        {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                            <option key={key} value={key}>
                                                {key === 'PIX' ? '💳' : key === 'CASH' ? '💵' : '💳'} {value}
                                            </option>
                                        ))}
                                    </SelectWithEmoji>
                                </div>
                                <div>
                                    <CheckboxCard checked={watch("payment_received")}>
                                        <div className="checkbox-header">
                                            <input type="checkbox" {...register("payment_received")} />
                                            <span className="checkbox-title">💰 Pagamento Recebido</span>
                                        </div>
                                        <span className="checkbox-description">
                                            Marque se o pagamento já foi confirmado
                                        </span>
                                    </CheckboxCard>
                                </div>
                            </GridRow>
                        </Section>
                    </TabContent>

                    {/* Aba 5: Endereço */}
                    <TabContent active={activeTab === 4}>
                        <Section>
                            <SectionHeader>
                                <div className="section-icon">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </div>
                                <h3>Endereço de Entrega</h3>
                            </SectionHeader>

                            <CheckboxCard checked={editAddress} style={{ marginBottom: '1.5rem' }}>
                                <div className="checkbox-header">
                                    <input 
                                        type="checkbox" 
                                        disabled={pickupAddress} 
                                        checked={editAddress}
                                        onChange={() => setEditAddress(!editAddress)}
                                    />
                                    <span className="checkbox-title">📝 Alterar Endereço</span>
                                </div>
                                <span className="checkbox-description">
                                    Editar o endereço de entrega
                                </span>
                            </CheckboxCard>

                            {editAddress && (
                                <>
                                    <GridRow style={{ marginBottom: '1rem' }}>
                                        <div>
                                            <Label>CEP</Label>
                                            <Input type="tel" placeholder="CEP" {...register("clientAddress.postal_code", {
                                                required: "CEP inválido",
                                            })}/>
                                            {errors.clientAddress?.postal_code && <ErrorMessage>{errors.clientAddress.postal_code.message}</ErrorMessage>}
                                        </div>
                                        <div>
                                            <Label>Rua</Label>
                                            <Input type="text" placeholder="Rua" {...register("clientAddress.street", {
                                                required: "Rua inválida",
                                            })}/>
                                            {errors.clientAddress?.street && <ErrorMessage>{errors.clientAddress.street.message}</ErrorMessage>}
                                        </div>
                                    </GridRow>
                                    
                                    <GridRow style={{ marginBottom: '1rem' }}>
                                        <div>
                                            <Label>Número</Label>
                                            <Input type="text" placeholder="Número" {...register("clientAddress.street_number", {
                                                required: "Número inválido",
                                            })}/>
                                            {errors.clientAddress?.street_number && <ErrorMessage>{errors.clientAddress.street_number.message}</ErrorMessage>}
                                        </div>
                                        <div>
                                            <Label>Complemento</Label>
                                            <Input type="text" placeholder="Complemento" {...register("clientAddress.complement")}/>
                                        </div>
                                    </GridRow>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <Label>Ponto de referência</Label>
                                        <Input type="text" placeholder="Ponto de referência" {...register("clientAddress.reference_point")}/>
                                    </div>

                                    <GridRow style={{ marginBottom: '1rem' }}>
                                        <div>
                                            <Label>Bairro</Label>
                                            <Input type="text" placeholder="Bairro" {...register("clientAddress.neighborhood", {
                                                required: "Bairro inválido",
                                            })}/>
                                            {errors.clientAddress?.neighborhood && <ErrorMessage>{errors.clientAddress.neighborhood.message}</ErrorMessage>}
                                        </div>
                                        <div>
                                            <Label>Cidade</Label>
                                            <Input type="text" placeholder="Cidade" {...register("clientAddress.city", {
                                                required: "Cidade inválido",
                                            })}/>
                                            {errors.clientAddress?.city && <ErrorMessage>{errors.clientAddress.city.message}</ErrorMessage>}
                                        </div>
                                    </GridRow>

                                    <GridRow>
                                        <div>
                                            <Label>Estado</Label>
                                            <Input type="text" placeholder="Estado" {...register("clientAddress.state", {
                                                required: "Estado inválido",
                                            })}/>
                                            {errors.clientAddress?.state && <ErrorMessage>{errors.clientAddress.state.message}</ErrorMessage>}
                                        </div>
                                        <div>
                                            <Label>País</Label>
                                            <Input type="text" placeholder="País" {...register("clientAddress.country", {
                                                required: "País inválido",
                                            })}/>
                                            {errors.clientAddress?.country && <ErrorMessage>{errors.clientAddress.country.message}</ErrorMessage>}
                                        </div>
                                    </GridRow>
                                </>
                            )}

                            {!editAddress && (
                                <div style={{ 
                                    background: '#fafafa', 
                                    padding: '1.5rem', 
                                    borderRadius: '0.75rem',
                                    border: '2px solid #f0f0f0'
                                }}>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        <strong>Endereço atual:</strong>
                                    </p>
                                    <p style={{ margin: 0, lineHeight: '1.6' }}>
                                        {order.clientAddress.street}, {order.clientAddress.street_number}
                                        {order.clientAddress.complement && ` - ${order.clientAddress.complement}`}
                                        <br />
                                        {order.clientAddress.neighborhood}, {order.clientAddress.city} - {order.clientAddress.state}
                                        <br />
                                        CEP: {order.clientAddress.postal_code}
                                    </p>
                                </div>
                            )}
                        </Section>
                    </TabContent>
                </Form>

                <ModalFooter>
                    <CancelButton type="button" onClick={() => setIsConfirmCancelOpen(true)}>
                        Cancelar Pedido
                    </CancelButton>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <DiscardButton type="button" onClick={onRequestClose}>
                            Descartar Alterações
                        </DiscardButton>
                        <SaveButton type="button" onClick={handleSubmit(handleOrder)} disabled={showProductError}>
                            <FontAwesomeIcon icon={faSave} />
                            Salvar Alterações
                        </SaveButton>
                    </div>
                </ModalFooter>

                {showProductError && (
                    <ErrorMessage style={{ textAlign: 'center', marginTop: '10px' }}>
                        Verifique os produtos antes de salvar
                    </ErrorMessage>
                )}
            </ModalContainer>

			<ConfirmPopUp
				isOpen={isConfirmCancelOpen}
				onRequestClose={() => setIsConfirmCancelOpen(false)}
				handleAction={handleCancelOrder}
				actionLabel="Tem certeza que deseja cancelar este pedido?"
				label="Sim, cancelar pedido"
			/>

			<ChangeClientModal
				isOpen={isChangeClientModalOpen}
				onRequestClose={() => setIsChangeClientModalOpen(false)}
				onSelectClient={handleSelectClient}
			/>
        </Modal>
    )
}
