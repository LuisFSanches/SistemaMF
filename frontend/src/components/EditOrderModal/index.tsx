import { useEffect, useState, useRef } from "react";
import Modal from 'react-modal';
import moment from "moment";
import { IOrder } from "../../interfaces/IOrder";
import { useForm } from "react-hook-form";
import {
	ModalContainer,
	Form,
	Input,
	Select,
	Textarea,
	EditFormField,
	ErrorMessage,
	Label,
	InlineFormField,
	CheckboxContainer,
	Checkbox,
	DescriptionArea,
	ProductContainer
} from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useOrders } from "../../contexts/OrdersContext";
import { PAYMENT_METHODS, STATUS_LABEL } from "../../constants";
import { updateOrder, updateStatus } from "../../services/orderService";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { searchProducts } from "../../services/productService";
import { getPickupAddress } from "../../services/addressService";
import { Loader } from "../Loader";
import { ConfirmPopUp } from "../ConfirmPopUp";
import { ModalHeader, CancelButton } from "./style";

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
				const response = await searchProducts(text);
	
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
		updateProducts(index, "product", product);
		updateProducts(index, "price", product.price);
		updateProducts(index, "product_id", product.id);
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
				product_id: "",
				quantity: 1,
				price: 0,
				product: {
					name: '',
					price: 0,
					unity: 'UN',
					stock: 0,
					enabled: true,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				},
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
			?.map((p) => `${p.quantity}x ${p.product.name} - R$ ${p.price}`)
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
                    <ModalHeader>
						<h2>Editar Pedido #{order?.code}</h2>
						<CancelButton type="button" onClick={() => setIsConfirmCancelOpen(true)}>
							Cancelar Pedido
						</CancelButton>
					</ModalHeader>
					{order?.orderItems?.length > 0 &&
						<EditFormField>
							<Label>Produtos do pedido</Label>
							<ProductContainer isEditModal>
								{products?.map((p: any, index: number) => (
									<>
										<div className="product-data" key={index}>
											<div>
												<Label>Quantidade</Label>
												<Input
													type="number"
													placeholder="0"
													value={p.quantity}
													onChange={(e) => updateProducts(index, 'quantity', Number(e.target.value))}/>
											</div>
									
											<div
												key={p.id}
												style={{ position: 'relative', width: '100%' }}
												ref={(el) => (productRefs.current[index] = el)}
											>
												<Label>Produto</Label>
												<Input
													placeholder="Produto"
													value={queries[index] ?? p.product.name}
													onChange={(e) => handleSearchProducts(index, e.target.value)}
													onFocus={() => (queries[index] || p.product.name) &&
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
												<Label>Valor</Label>
												<Input
													placeholder="Valor"
													type="number"
													value={p.price}
													step="0.1"
													onChange={(e) => updateProducts(index, 'price', Number(e.target.value))}
												/>
											</div>
											<div>
												<button
													type="button"
													className="delete-button"
													onClick={() => removeProduct(index)}
												><FontAwesomeIcon icon={faXmark}/></button>
											</div>
										</div>
									</>
								))}
								<div className="product-actions" style={{ marginTop: '0px' }}>
									<button type="button" className="add-button" onClick={addProduct}>
										Incluir Produto
									</button>
								</div>
							</ProductContainer>
						</EditFormField>
					}

					{products?.length > 0 &&
						<EditFormField>
							<Label>Descrição</Label>
							<DescriptionArea>
								{products?.map((p, index) => (
									<p key={index}>
										{p.quantity}x - {p.product.name} - R$ {p.price}
									</p>
								))}
							</DescriptionArea>
							{errors.description && (
								<ErrorMessage>{errors.description.message}</ErrorMessage>
							)}
						</EditFormField>
					}

					{order?.orderItems?.length === 0 &&
						<EditFormField>
							<Label>Descrição</Label>
							<Textarea {...register("description", {required: "Descrição inválida"})}/>
							<ErrorMessage>{errors.description?.message}</ErrorMessage>
						</EditFormField>
					}
					
					<EditFormField>
						<Label>Informações Adicionais</Label>
						<Textarea {...register("additional_information")}/>
					</EditFormField>
					<InlineFormField fullWidth>
						<EditFormField isShortField>
							<Label>Nome do Cliente</Label>
							<Input {...register("client.first_name", {required: "Descrição inválida"})} disabled/>
						</EditFormField>
						<EditFormField isShortField>
							<Label>Telefone do Cliente</Label>
							<Input {...register("client.phone_number", {required: "Descrição inválida"})} disabled/>
						</EditFormField>
					</InlineFormField>
					{ (order?.receiver_phone || order?.receiver_name) &&
						<InlineFormField fullWidth>
							<EditFormField isShortField>
								<Label>Nome do Recebedor</Label>
								<Input {...register("receiver_name")}/>
							</EditFormField>
							<EditFormField isShortField>
								<Label>Telefone do Recebedor</Label>
								<Input {...register("receiver_phone")}/>
							</EditFormField>
						</InlineFormField>
					}

					<InlineFormField fullWidth>
						<EditFormField isShortField>
							<Label>Valor dos Produtos</Label>
							<Input type="number" step="0.01" disabled={products?.length > 0}
								{...register("products_value", {required: "Valor Inválido"})}/>
							<ErrorMessage>{errors.products_value?.message}</ErrorMessage>
						</EditFormField>
						<EditFormField isShortField>
							<Label>Desconto</Label>
							<Input type="number" step="0.01" {...register("discount")}/>
						</EditFormField>
						<EditFormField isShortField>
							<Label>Taxa de Entrega</Label>
							<Input type="number" step="0.01" {...register("delivery_fee", {required: "Valor Inválido"})}/>
							<ErrorMessage>{errors.delivery_fee?.message}</ErrorMessage>
						</EditFormField>
						<EditFormField isShortField>
							<Label>Total</Label>
							<Input type="number" step="0.01" {...register("total", {required: "Valor Inválido"})} disabled/>
							<ErrorMessage>{errors.total?.message}</ErrorMessage>
						</EditFormField>
					</InlineFormField>

					<InlineFormField fullWidth>
						<EditFormField isShortField>
							<Label>Método de pagamento</Label>
							<Select {...register("payment_method")} isEditField>
								{Object.entries(PAYMENT_METHODS).map(([key, value]) => (
									<option key={key} value={key}>{value}</option>
								))}
							</Select>
						</EditFormField>
						<EditFormField isShortField>
							<Label>Status do Pedido</Label>
							<Select {...register("status")} isEditField>
								{Object.entries(STATUS_LABEL).map(([key, value]) => (
									<option key={key} value={key}>{value}</option>
								))}
							</Select>
						</EditFormField>
						<EditFormField isShortField>
							<Label>Data de Entrega</Label>
							<Input type="date" {...register("delivery_date", {
								required: "Data de entrega é obrigatória",
							})}
							/>
							{errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
						</EditFormField>
					</InlineFormField>
					<InlineFormField fullWidth>
						<EditFormField isShortField>
							<CheckboxContainer>
								<Checkbox type="checkbox" {...register("payment_received")} />
								<Label>Pagamento Recebido</Label>
							</CheckboxContainer>
						</EditFormField>

						<EditFormField isShortField>
							<CheckboxContainer>
								<Checkbox type="checkbox" {...register("has_card")} />
								<Label>Pedido Contém Cartão</Label>
							</CheckboxContainer>
						</EditFormField>						
					</InlineFormField>

					<InlineFormField fullWidth>
						<EditFormField>
							<CheckboxContainer>
								<Checkbox type="checkbox" disabled={pickupAddress} checked={editAddress}
									onChange={() => setEditAddress(!editAddress)}
								/>
								<Label>Alterar endereço</Label>
							</CheckboxContainer>
						</EditFormField>

						<EditFormField>
							<CheckboxContainer>
								<Checkbox type="checkbox" checked={pickupAddress}
									onChange={(e) => handlePickUpAddress(e.target.checked)}
								/>
								<Label>Retirar no Local</Label>
							</CheckboxContainer>
						</EditFormField>
					</InlineFormField>

					{ editAddress &&
						<>
							<InlineFormField fullWidth>
								<EditFormField isShortField>
									<Label>CEP</Label>
									<Input type="tel" placeholder="CEP" {...register("clientAddress.postal_code", {
										required: "CEP inválido",
									})}
									/>
									{errors.clientAddress?.postal_code && <ErrorMessage>{errors.clientAddress.postal_code.message}</ErrorMessage>}
								</EditFormField>
								<EditFormField>
									<Label>Rua</Label>
									<Input type="text" placeholder="Rua" {...register("clientAddress.street", {
										required: "Rua inválida",
										})}
									/>
									{errors.clientAddress?.street && <ErrorMessage>{errors.clientAddress.street.message}</ErrorMessage>}
								</EditFormField>
							</InlineFormField>
							
							<InlineFormField fullWidth>
								<EditFormField isShortField>
									<Label>Número</Label>
									<Input type="text" placeholder="Número" {...register("clientAddress.street_number", {
										required: "Número inválido",
										})}
									/>
									{errors.clientAddress?.street_number && <ErrorMessage>{errors.clientAddress.street_number.message}</ErrorMessage>}
								</EditFormField>
								<EditFormField>
									<Label>Complemento</Label>
									<Input type="text" placeholder="Complemento" {...register("clientAddress.complement")}
									/>
								</EditFormField>
							</InlineFormField>
							<EditFormField>
									<Label>Ponto de referência</Label>
									<Input type="text" placeholder="Ponto de referência" {...register("clientAddress.reference_point")}
									/>
							</EditFormField>
							<InlineFormField fullWidth>
								<EditFormField>
									<Label>Bairro</Label>
									<Input type="text" placeholder="Bairro" {...register("clientAddress.neighborhood", {
										required: "Bairro inválido",
										})}
									/>
									{errors.clientAddress?.neighborhood && <ErrorMessage>{errors.clientAddress.neighborhood.message}</ErrorMessage>}
								</EditFormField>
								<EditFormField isShortField>
									<Label>País</Label>
									<Input type="text" placeholder="País" {...register("clientAddress.country", {
										required: "País inválido",
										})}
									/>
									{errors.clientAddress?.country && <ErrorMessage>{errors.clientAddress.country.message}</ErrorMessage>}
								</EditFormField>
							</InlineFormField>

							<InlineFormField fullWidth>
								<EditFormField>
									<Label>Estado</Label>
									<Input type="text" placeholder="Estado" {...register("clientAddress.state", {
										required: "Estado inválido",
										})}
									/>
									{errors.clientAddress?.state && <ErrorMessage>{errors.clientAddress.state.message}</ErrorMessage>}
								</EditFormField>
								<EditFormField>
									<Label>Cidade</Label>
									<Input type="text" placeholder="Cidade" {...register("clientAddress.city", {
										required: "Cidade inválido",
										})}
									/>
									{errors.clientAddress?.city && <ErrorMessage>{errors.clientAddress.city.message}</ErrorMessage>}
								</EditFormField>
							</InlineFormField>
						</>
					}
                    <button type="submit" className="create-button" disabled={showProductError}>
                        Editar
                    </button>
					{showProductError &&
						<ErrorMessage style={{ textAlign: 'center', marginTop: '10px' }}>
							Verifique os produtos
						</ErrorMessage>}
                </Form>
            </ModalContainer>

			<ConfirmPopUp
				isOpen={isConfirmCancelOpen}
				onRequestClose={() => setIsConfirmCancelOpen(false)}
				handleAction={handleCancelOrder}
				actionLabel="Tem certeza que deseja cancelar este pedido?"
				label="Sim, cancelar pedido"
			/>
        </Modal>
    )
}
