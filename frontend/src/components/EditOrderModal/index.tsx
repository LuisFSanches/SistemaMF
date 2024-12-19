import { useEffect, useState } from "react";
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
} from '../../styles/global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useOrders } from "../../contexts/OrdersContext";
import { PAYMENT_METHODS, STATUS_LABEL } from "../../constants";
import { updateOrder } from "../../services/orderService";
import { getPickupAddress } from "../../services/addressService";
import { Loader } from "../Loader";

interface IEditOrderModal{
	isOpen: boolean;
    onRequestClose: ()=> void;
    order: IOrder
}

export function EditOrderModal({
    isOpen,
    onRequestClose,
    order
}:IEditOrderModal){
    const { loadAvailableOrders, editOrder } = useOrders();
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
			delivery_fee: Number(formData.delivery_fee),
			total: Number(formData.products_value) + Number(formData.delivery_fee),
			payment_method: formData.payment_method,
			payment_received: formData.payment_received,
			delivery_date: new Date(`${formData.delivery_date}T00:00:00Z`),
			status: formData.status,
			has_card: formData.has_card,
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
			}
        }

		const { data: orderData } = await updateOrder(data);

		editOrder(orderData);
		loadAvailableOrders();
		setShowLoader(false);
		onRequestClose();
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
    }, [order, setValue]);

	useEffect(() => {
		setValue("total", Number(watch("products_value")) + Number(watch("delivery_fee")));
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watch("products_value"), watch("delivery_fee")]);

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
                    <h2>Editar Pedido #{order.code}</h2>
					<EditFormField>
						<Label>Descrição</Label>
						<Textarea {...register("description", {required: "Descrição inválida"})}/>
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					</EditFormField>
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
					{ (order.receiver_phone || order.receiver_name) &&
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
							<Input type="number" step="0.01" {...register("products_value", {required: "Valor Inválido"})}/>
							<ErrorMessage>{errors.products_value?.message}</ErrorMessage>
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
                    <button type="submit" className="create-button">
                        Editar
                    </button>
                </Form>
            </ModalContainer>
        </Modal>
    )
}
