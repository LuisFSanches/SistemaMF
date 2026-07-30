import { useState, useEffect } from "react";
import moment from "moment";
import { IOrder } from "../../interfaces/IOrder";
import { DateRangePicker } from "../../components/DateRangePicker";
import { ICreateOrderToReceive } from "../../interfaces/IOrderToReceive";
import { Container, Orders, Header, OrderContainer, CardsContainer } from "./style";
import { updateStatus, updateOrderPaymentStatus } from "../../services/orderService";
import { checkOrderToReceiveExists } from "../../services/orderToReceiveService";
import { OrderCard } from "../../components/OrderCard";
import { OrderFilterCard } from "../../components/OrderFilterCard";
import { OrderFilterPopover, IOrderFilters, EMPTY_ORDER_FILTERS } from "../../components/OrderFilterPopover";
import { useOrders } from "../../contexts/OrdersContext";
import { useOrdersToReceive } from "../../contexts/OrdersToReceiveContext";
import { useOrderDeliveries } from "../../contexts/OrderDeliveriesContext";
import { useSuccessMessage } from "../../contexts/SuccessMessageContext";
import { Loader } from "../../components/Loader";
import { EditOrderModal } from "../../components/EditOrderModal";
import { PaymentStatusModal } from "../../components/PaymentStatusModal";
import { SelectDeliveryManModal } from "../../components/SelectDeliveryManModal";
import { faStore, faTruck, faClockRotateLeft, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const normalizeText = (value: string) =>
	value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const onlyDigits = (value: string) => value.replace(/\D/g, '');

export function ServiceOrdersPage(){
	const { onGoingOrders, editOrder, loadOnGoingOrders } = useOrders();
	const { createOrderToReceive } = useOrdersToReceive();
	const { createOrderDelivery } = useOrderDeliveries();
	const { showSuccess } = useSuccessMessage();

	const [openedOrders, setOpenedOrders] = useState<IOrder[]>([]);
	const [inProgressOrders, setInProgressOrders] = useState<IOrder[]>([]);
	const [inDeliveryOrders, setInDeliveryOrders] = useState<IOrder[]>([]);
	const [showLoader, setShowLoader] = useState(false);
	const [requestOrders, setRequestOrders] = useState(false);
    const [editOrderModal, setEditOrderModal] = useState(false);
    const [paymentStatusModal, setPaymentStatusModal] = useState(false);
	const [selectDeliveryManModal, setSelectDeliveryManModal] = useState(false);
	const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
	const [selectedOrderType, setSelectedOrderType] = useState("all-orders");
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);
	const [dateFilterType, setDateFilterType] = useState<string>("all-dates");
	const [activeCardFilter, setActiveCardFilter] = useState<string | null>(null);
	const [orderFilters, setOrderFilters] = useState<IOrderFilters>(EMPTY_ORDER_FILTERS);

    function handleOpenEditOrderModal(order: IOrder){
		console.log('edit order', order);
        setEditOrderModal(true);
        setCurrentOrder(order);
    }

	const fetchOrders = async () => {
		setShowLoader(true);
		setOpenedOrders(onGoingOrders.filter((order: IOrder) => order.status === "OPENED"));
		setInProgressOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_PROGRESS"));
		setInDeliveryOrders(onGoingOrders.filter((order: IOrder) => order.status === "IN_DELIVERY"));
		setShowLoader(false);
	};

	useEffect(() => {
		fetchOrders();
		if (onGoingOrders.length === 0 && !requestOrders) {
			loadOnGoingOrders(false);
			setRequestOrders(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoingOrders]);

	useEffect(() => {
		applyDateAndTypeFilters();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [onGoingOrders, startDate, endDate, dateFilterType, selectedOrderType, orderFilters]);

	const handleOrderStatus = async (id: string, status: string) => {
		setShowLoader(true);
		const orderToUpdate = onGoingOrders.find(order => order.id === id);

		if (status === 'DONE' && orderToUpdate) {
			if (orderToUpdate.is_delivery) {
				setCurrentOrder(orderToUpdate);
				setSelectDeliveryManModal(true);
				setShowLoader(false);
				return;
			}

			if (!orderToUpdate.payment_received) {
				try {
					const existsInOrdersToReceive: any = await checkOrderToReceiveExists(id);
					
					if (existsInOrdersToReceive.exists) {
						const response = await updateStatus({ id, status: 'DONE' });
						const { data: order } = response;
						editOrder(order);
						setShowLoader(false);
						return;
					}
					
					setCurrentOrder(orderToUpdate);
					setPaymentStatusModal(true);
					setShowLoader(false);
					return;
				} catch (error) {
					console.error("Error checking order to receive:", error);
					setCurrentOrder(orderToUpdate);
					setPaymentStatusModal(true);
					setShowLoader(false);
					return;
				}
			}
		}

		const response = await updateStatus({ id, status });
		const { data: order } = response;
		editOrder(order);
		setShowLoader(false);
	}

	const handleConfirmPayment = async () => {
		if (!currentOrder) return;
		setShowLoader(true);
		await updateOrderPaymentStatus(currentOrder.id!, true);
		const response = await updateStatus({ id: currentOrder.id!, status: 'DONE' });
		const { data: order } = response;
		editOrder(order);
		showSuccess("Pagamento confirmado e pedido movido para concluído!");
		setShowLoader(false);
		setPaymentStatusModal(false);
		setCurrentOrder(null);
	};

	const handleCreateOrderToReceive = async (data: ICreateOrderToReceive) => {
		if (!currentOrder) return;
		setShowLoader(true);
		await createOrderToReceive(data);
		const response = await updateStatus({ id: currentOrder.id!, status: 'DONE' });
		const { data: order } = response;
		editOrder(order);
		showSuccess("Valor a receber criado e pedido movido para concluído!");
		setShowLoader(false);
		setPaymentStatusModal(false);
		setCurrentOrder(null);
	};

	const handleConfirmDeliveryMan = async (deliveryManId: string, deliveryDate: string) => {
		if (!currentOrder) return;
		setShowLoader(true);
		try {
			await createOrderDelivery({
				order_id: currentOrder.id!,
				delivery_man_id: deliveryManId,
				delivery_date: deliveryDate,
				store_id: currentOrder.store_id
			});

			const response = await updateStatus({ id: currentOrder.id!, status: 'DONE' });
			const { data: order } = response;
			editOrder(order);
			
			showSuccess("Entrega criada e pedido finalizado com sucesso!");
			setSelectDeliveryManModal(false);
			setCurrentOrder(null);
		} catch (error) {
			console.error("Error creating delivery:", error);
			alert("Erro ao criar entrega. Tente novamente.");
		} finally {
			setShowLoader(false);
		}
	};

	const matchesOrderFilters = (order: IOrder) => {
		const { clientName, orderCode, phoneNumber, productName } = orderFilters;

		if (clientName) {
			const lowerName = normalizeText(clientName);
			const fullName = normalizeText(`${order.client.first_name} ${order.client.last_name}`);
			if (!fullName.includes(lowerName)) return false;
		}

		if (orderCode) {
			// eslint-disable-next-line eqeqeq
			if (order.code != orderCode) return false;
		}

		if (phoneNumber) {
			if (!onlyDigits(order.client.phone_number).includes(onlyDigits(phoneNumber))) return false;
		}

		if (productName) {
			const lowerProduct = normalizeText(productName);
			const matchesDescription = order.description && normalizeText(order.description).includes(lowerProduct);
			const matchesItem = (order.orderItems || []).some((item: any) =>
				(item?.storeProduct?.product?.name && normalizeText(item.storeProduct.product.name).includes(lowerProduct)) ||
				(item?.storeProduct?.description && normalizeText(item.storeProduct.description).includes(lowerProduct)) ||
				(item?.product?.name && normalizeText(item.product.name).includes(lowerProduct)) ||
				(item?.product?.description && normalizeText(item.product.description).includes(lowerProduct))
			);
			if (!matchesDescription && !matchesItem) return false;
		}

		return true;
	};

	const applyDateAndTypeFilters = () => {
		const filterByDate = (order: IOrder) => {
			if (!startDate && !endDate) return true;
			const orderDate = moment(order.delivery_date);

			if (dateFilterType === "today" || dateFilterType === "yesterday") {
				return orderDate.isSame(moment(startDate), "day");
			} else if (dateFilterType === "week") {
				return orderDate.isBetween(moment(startDate), moment(endDate), "day", "[]");
			} else if (dateFilterType === "custom" && startDate && endDate) {
				return orderDate.isBetween(moment(startDate), moment(endDate), "day", "[]");
			}
			return true;
		};

		let filteredOrders = onGoingOrders;

		if (selectedOrderType === "counter-orders") {
			filteredOrders = onGoingOrders.filter((order: IOrder) =>
				!order.online_order && order.is_delivery && !order.store_front_order
			);
		} else if (selectedOrderType === "store-front-orders") {
			filteredOrders = onGoingOrders.filter((order: IOrder) => order.store_front_order);
		} else if (selectedOrderType === "online-orders") {
			filteredOrders = onGoingOrders.filter((order: IOrder) => order.online_order);
		} else if (selectedOrderType === "store-orders") {
			filteredOrders = onGoingOrders.filter((order: IOrder) =>
				!order.is_delivery && !order.store_front_order
			);
		}

		filteredOrders = filteredOrders.filter(matchesOrderFilters);

		setOpenedOrders(filteredOrders.filter(order => order.status === "OPENED" && filterByDate(order)));
		setInProgressOrders(filteredOrders.filter(order => order.status === "IN_PROGRESS" && filterByDate(order)));
		setInDeliveryOrders(filteredOrders.filter(order => order.status === "IN_DELIVERY" && filterByDate(order)));
	};

	const filterOrdersByType = (orderType: string) => {
		setSelectedOrderType(orderType);
	};

	const handleDateRangeChange = (start: string | null, end: string | null, filterType: string) => {
		setStartDate(start);
		setEndDate(end);
		setDateFilterType(filterType);
	};

	// Calculate card counts
	const pickupOrders = onGoingOrders.filter((order: IOrder) => 
		!order.is_delivery && order.status !== "DONE" && order.status !== "WAITING_FOR_CLIENT" &&
		order.status !== "PENDING_PAYMENT"
	);

	const deliveryOrders = onGoingOrders.filter((order: IOrder) => 
		order.is_delivery && order.status !== "DONE" && order.status !== "WAITING_FOR_CLIENT" &&
		order.status !== "PENDING_PAYMENT"
	);

	const expiredPickupOrders = onGoingOrders.filter((order: IOrder) => 
		!order.is_delivery && 
		order.status !== "DONE" && order.status !== "PENDING_PAYMENT" && order.status !== "WAITING_FOR_CLIENT" &&
		moment(order.delivery_date).isBefore(moment(), 'day')
	);

	const expiredDeliveryOrders = onGoingOrders.filter((order: IOrder) => 
		order.is_delivery && 
		order.status !== "DONE" && order.status !== "PENDING_PAYMENT" && order.status !== "WAITING_FOR_CLIENT" && 
		moment(order.delivery_date).isBefore(moment(), 'day')
	);

	const handleCardFilterClick = (filterType: string) => {
		if (activeCardFilter === filterType) {
			setActiveCardFilter(null);
			applyDateAndTypeFilters();
		} else {
			setActiveCardFilter(filterType);
			applyCardFilter(filterType);
		}
	};

	const applyCardFilter = (filterType: string) => {
		let filteredOrders: IOrder[] = [];

		switch (filterType) {
			case 'pickup':
				filteredOrders = onGoingOrders.filter((order: IOrder) => 
					!order.is_delivery && order.status !== "DONE"
				);
				break;
			case 'delivery':
				filteredOrders = onGoingOrders.filter((order: IOrder) => 
					order.is_delivery && order.status !== "DONE"
				);
				break;
			case 'expired-pickup':
				filteredOrders = onGoingOrders.filter((order: IOrder) => 
					!order.is_delivery && 
					order.status !== "DONE" && 
					moment(order.delivery_date).isBefore(moment(), 'day')
				);
				break;
			case 'expired-delivery':
				filteredOrders = onGoingOrders.filter((order: IOrder) => 
					order.is_delivery && 
					order.status !== "DONE" && 
					moment(order.delivery_date).isBefore(moment(), 'day')
				);
				break;
			default:
				filteredOrders = onGoingOrders;
		}

		setOpenedOrders(filteredOrders.filter(order => order.status === "OPENED"));
		setInProgressOrders(filteredOrders.filter(order => order.status === "IN_PROGRESS"));
		setInDeliveryOrders(filteredOrders.filter(order => order.status === "IN_DELIVERY"));
	};
	
	
    return (
		<Container>
			<Loader show={showLoader} />
			<CardsContainer>
				<OrderFilterCard
					title="Pedidos a Retirar"
					value={pickupOrders.length}
					icon={faStore}
					color="#4A90E2"
					isActive={activeCardFilter === 'pickup'}
					onClick={() => handleCardFilterClick('pickup')}
				/>
				<OrderFilterCard
					title="Pedidos a Entregar"
					value={deliveryOrders.length}
					icon={faTruck}
					color="#6aa84f"
					isActive={activeCardFilter === 'delivery'}
					onClick={() => handleCardFilterClick('delivery')}
				/>
				<OrderFilterCard
					title="Pedidos Retirada Vencidos"
					value={expiredPickupOrders.length}
					icon={faClockRotateLeft}
					color="#f4d47c"
					isActive={activeCardFilter === 'expired-pickup'}
					onClick={() => handleCardFilterClick('expired-pickup')}
				/>
				<OrderFilterCard
					title="Pedidos Entrega Vencidos"
					value={expiredDeliveryOrders.length}
					icon={faTriangleExclamation}
					color="#E52E40"
					isActive={activeCardFilter === 'expired-delivery'}
					onClick={() => handleCardFilterClick('expired-delivery')}
				/>
			</CardsContainer>
			<Header>
				<div className="type-filters">
					<button className={`all-orders ${selectedOrderType === "all-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("all-orders")}>
							Todos
					</button>
					<button className={`store-front-orders ${selectedOrderType === "store-front-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("store-front-orders")}>
							Ordens Via Site
					</button>
					<button className={`counter-orders ${selectedOrderType === "counter-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("counter-orders")}>
							Ordens Balcão
					</button>
					<button className={`online-orders ${selectedOrderType === "online-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("online-orders")}>
							Ordens Whatsapp
					</button>
					<button className={`store-orders ${selectedOrderType === "store-orders" ? "active" : ""}`}
						onClick={() => filterOrdersByType("store-orders")}>
						Ordens PDV
					</button>
				</div>
				<div className="date-filters">
					<DateRangePicker onDateRangeChange={handleDateRangeChange} />
					<OrderFilterPopover filters={orderFilters} onApply={setOrderFilters} right="0" />
				</div>
 			</Header>
			<Orders>
				<OrderContainer className="opened">
					<header className="opened-order">
						Ordem Aberta
					</header>
					{openedOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handleOrderStatus={handleOrderStatus}
								buttonStatus="to-production"
								previousButtonStatus={null}
								nextStatus="IN_PROGRESS"
								previousStatus={null}
								nextAction="Em produção"
								previousAction={null}
								handleOpenEditOrderModal={handleOpenEditOrderModal}
							/>
						</div>
					))}
				</OrderContainer>
				<OrderContainer className="in_progress">
					<header className="in-progress-order">
						Em produção
					</header>
					{inProgressOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handleOrderStatus={handleOrderStatus}
								buttonStatus="to-finished"
								previousButtonStatus="to-open"
								nextStatus="IN_DELIVERY"
								previousStatus="OPENED"
								nextAction="Entrega"
								previousAction="Aberta"
								handleOpenEditOrderModal={handleOpenEditOrderModal}
							/>
						</div>
					))}
				</OrderContainer>
				<OrderContainer className="in_delivery">
					<header className="finished-order">
						Rota de Entrega
					</header>
					{inDeliveryOrders.map((order: any) => (
						<div key={order.id} id={`order-card-${order.id}`}>
							<OrderCard order={order}
								handleOrderStatus={handleOrderStatus}
								buttonStatus="delivered"
								previousButtonStatus="to-production"
								nextStatus="DONE"
								previousStatus="IN_PROGRESS"
								nextAction="Finalizado"
								previousAction="Produção"
								handleOpenEditOrderModal={handleOpenEditOrderModal}
							/>
						</div>
					))}
				</OrderContainer>
			</Orders>

			<EditOrderModal
                isOpen={editOrderModal}
                onRequestClose={() => setEditOrderModal(false)}
                order={currentOrder as any}
            />

			{currentOrder && (
				<PaymentStatusModal
					isOpen={paymentStatusModal}
					onRequestClose={() => {
						setPaymentStatusModal(false);
						setCurrentOrder(null);
					}}
					order={currentOrder}
					onConfirmPayment={handleConfirmPayment}
					onCreateOrderToReceive={handleCreateOrderToReceive}
				/>
			)}

			<SelectDeliveryManModal
				isOpen={selectDeliveryManModal}
				onRequestClose={() => {
					setSelectDeliveryManModal(false);
					setCurrentOrder(null);
				}}
				order={currentOrder}
				onConfirm={handleConfirmDeliveryMan}
				isLoading={showLoader}
			/>
		</Container>
	)
}
