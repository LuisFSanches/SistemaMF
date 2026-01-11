import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IOrder } from "../../interfaces/IOrder";
import { Container } from "./style";
import { PageHeader } from "../../styles/global";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { OrderDetailModal } from "../../components/OrderDetailModal";
import { EditOrderModal } from "../../components/EditOrderModal";
import { Pagination } from "../../components/Pagination";
import { DateRangePicker } from "../../components/DateRangePicker";
import { PrintOrder } from '../../components/PrintOrder';
import { useOrders } from "../../contexts/OrdersContext";
import { useAdmins } from "../../contexts/AdminsContext";
import { STATUS_LABEL } from "../../constants";
import { formatTitleCase } from "../../utils";

export function OrdersPage(){
    const { orders, loadAvailableOrders, totalOrders } = useOrders();
    const { admins } = useAdmins();

    const [orderDetailModal, setOrderDetailModal] = useState(false);
    const [editOrderModal, setEditOrderModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<IOrder | null>(null);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const pageSize = 15;

    function handleOpenOrderDetailModal(order: IOrder){
        setOrderDetailModal(true);
        setCurrentOrder(order);
    }
    function handleCloseOrderDetailModal(){
        setOrderDetailModal(false);
    }

    function handleOpenEditOrderModal(order: IOrder){
        setEditOrderModal(true);
        setCurrentOrder(order);
    }

    const searchOrders = (query: string) => {
        setQuery(query);
        setPage(1);
        loadAvailableOrders(page, pageSize, query, startDate, endDate);
    }

    const resetSearch = (query: string) => {
        if (query === '') {
            setQuery('');
            setPage(1);
            loadAvailableOrders(page, pageSize, '', startDate, endDate);
        }
    }

    const handleDateRangeChange = (start: string | null, end: string | null, filterType: string) => {
        setStartDate(start);
        setEndDate(end);
        setPage(1);
    };

    const getName = (first_name: string, last_name: string) => {
        if (first_name === 'Cliente') {
            return '';
        }

        return `${first_name} ${last_name}`
    }

    useEffect(() => {
        loadAvailableOrders(page, pageSize, query, startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, startDate, endDate]);

    return(
        <Container>
            <PageHeader>
            	<h1>Todos os Pedidos</h1>
                <div>
                    <input
                        style={{width: '310px'}}
                        type="text"
                        placeholder="Buscar por Nome, Telefone ou Código"
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                searchOrders(e.target.value);
                            }
                        }}
                        onChange={(e) => resetSearch(e.target.value)}
                    />
                    <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                </div>
                <Pagination 
                    currentPage={page}
                    total={totalOrders}
                    pageSize={pageSize as number}
                    onPageChange={setPage}
                />
            </PageHeader>
            <table className="responsive-table">
                <thead className="head">
                    <tr>
                        <th>Pedido</th>
                        <th className="description">Descrição</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map(order => (
                        <>
                            <tr key={order.id} className={order.status === 'CANCELED' ? 'canceled-order' : ''}>
                                <td data-label="Pedido">
                                    <Link to={`/backoffice/pedido/${order.id}`} className="order-code-link">
                                        #{order.code}
                                    </Link>
                                </td>
                                <td  className="description" data-label="Descrição">{formatTitleCase(order.description)}</td>
                                <td data-label="Cliente">
                                    {order.status !== "WAITING_FOR_CLIENT"
                                        ? `${formatTitleCase(order.client.first_name)} ${formatTitleCase(order.client.last_name)}`
                                        : "Pendente"}
                                </td>
                                <td data-label="Status">{STATUS_LABEL[order.status]}</td>
                                <td data-label="Total">R$ {order.total}</td>
                                <td className="table-icon">
                                    <button className="edit-button" onClick={() => handleOpenEditOrderModal(order)}>
                                        <FontAwesomeIcon icon={faPen}/>
                                    </button>
                                    <button className="view-button" onClick={() => handleOpenOrderDetailModal(order)}>
                                        <FontAwesomeIcon icon={faEye}/>
                                    </button>
                                    <PrintOrder
                                        order={order}
                                        orderCode={order.code}
                                        clientName={getName(order.client.first_name, order.client.last_name)}
                                        clientTelephone={order.client.phone_number !== '33333333333' ? order.client.phone_number : ''}
                                        admins={admins}
                                        buttonLabel="" />
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>

            <OrderDetailModal
                isOpen={orderDetailModal}
                onRequestClose={handleCloseOrderDetailModal}
                order={currentOrder as any}
            />

            <EditOrderModal
                isOpen={editOrderModal}
                onRequestClose={() => setEditOrderModal(false)}
                order={currentOrder as any}
            />
        </Container>
    )
}
