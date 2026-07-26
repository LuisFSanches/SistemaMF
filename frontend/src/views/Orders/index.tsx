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
import { DataTable, ColumnDef } from "../../components/DataTable";
import { RowActions, IconButton, IconLinkButton } from "../../components/DataTable/style";
import { Badge, BadgeTone } from "../../components/Badge";

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
    const pageSize = 8;

    function handleCloseOrderDetailModal(){
        setOrderDetailModal(false);
    }

    function handleOpenEditOrderModal(order: IOrder){
        setEditOrderModal(true);
        setCurrentOrder(order);
    }

    const handleQueryChange = (value: string) => {
        setQuery(value);
        setPage(1);
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

    const getStatusTone = (status: IOrder['status']): BadgeTone => {
        const tones: Record<string, BadgeTone> = {
            DONE: 'good',
            CANCELED: 'bad',
            PENDING_PAYMENT: 'warn',
            WAITING_FOR_CLIENT: 'warn',
            OPENED: 'info',
            IN_PROGRESS: 'info',
            IN_DELIVERY: 'info',
        };
        return tones[status] || 'neutral';
    };

    useEffect(() => {
        loadAvailableOrders(page, pageSize, query, startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, startDate, endDate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            loadAvailableOrders(1, pageSize, query, startDate, endDate);
        }, 350);
        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const columns: ColumnDef<IOrder>[] = [
        {
            key: 'code',
            header: 'Pedido',
            render: (order) => (
                <Link to={`/backoffice/pedido/${order.id}`} style={{ color: 'var(--dt-accent)', fontWeight: 700, textDecoration: 'none' }}>
                    #{order.code}
                </Link>
            ),
        },
        {
            key: 'description',
            header: 'Descrição',
            width: '40%',
            render: (order) => formatTitleCase(order.description),
        },
        {
            key: 'client',
            header: 'Cliente',
            width: '15%',
            render: (order) => (
                order.status !== "WAITING_FOR_CLIENT"
                    ? `${formatTitleCase(order.client.first_name)} ${formatTitleCase(order.client.last_name)}`
                    : "Pendente"
            ),
        },
        {
            key: 'status',
            header: 'Status',
            width: '13%',
            render: (order) => (
                <Badge tone={getStatusTone(order.status)}>
                    {STATUS_LABEL[order.status]}
                </Badge>
            ),
        },
        {
            key: 'total',
            header: 'Total',
            width: '9%',
            render: (order) => `R$ ${order.total}`,
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (order) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar" onClick={() => handleOpenEditOrderModal(order)}>
                        <FontAwesomeIcon icon={faPen}/>
                    </IconButton>
                    <IconLinkButton $tone="view" title="Visualizar" to={`/backoffice/pedido/${order.id}`}>
                        <FontAwesomeIcon icon={faEye}/>
                    </IconLinkButton>
                    <PrintOrder
                        order={order}
                        orderCode={order.code}
                        clientName={getName(order.client.first_name, order.client.last_name)}
                        clientTelephone={order.client.phone_number !== '33333333333' ? order.client.phone_number : ''}
                        admins={admins}
                        buttonLabel="" />
                </RowActions>
            ),
        },
    ];

    return(
        <Container>
            <PageHeader>
            	<h1>Todos os Pedidos</h1>
                <div>
                    <DateRangePicker onDateRangeChange={handleDateRangeChange} />
                </div>
            </PageHeader>

            <DataTable
                columns={columns}
                data={orders}
                rowKey={(order) => order.id as string}
                rowClassName={(order) => order.status === 'CANCELED' ? 'canceled-order' : undefined}
                searchPlaceholder="Buscar por Nome, Telefone ou Código"
                searchValue={query}
                onSearchChange={handleQueryChange}
                emptyTitle="Nenhum pedido encontrado"
                emptyDescription="Tente ajustar a busca ou o período selecionado."
                footer={
                    <>
                        <span className="dt-count">
                            Mostrando <strong>{orders.length}</strong> de <strong>{totalOrders}</strong>
                        </span>
                        <Pagination
                            currentPage={page}
                            total={totalOrders}
                            pageSize={pageSize as number}
                            onPageChange={setPage}
                        />
                    </>
                }
            />

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
