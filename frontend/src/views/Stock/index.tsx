import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faCopy, faPen } from "@fortawesome/free-solid-svg-icons";
import { convertMoney } from "../../utils";
import { Container } from "./style";
import { AddButton, PageHeader } from "../../styles/global";
import { StockTransactionModal } from "../../components/StockTransactionModal";
import { Pagination } from "../../components/Pagination";
import { SupplierSelect } from "../../components/SupplierSelect";
import { DataTable, ColumnDef } from "../../components/DataTable";
import { RowActions, IconButton } from "../../components/DataTable/style";
import { getStockTransactions, deleteStockTransaction } from "../../services/stockTransactionService";
import { IStockTransaction } from "../../interfaces/IStockTransaction";

export function StockPage(){
    const navigate = useNavigate();
    const [clientModalModal, setClientModal] = useState(false);
    const [action, setAction] = useState("");
    const [stockTransactions, setStockTransactions] = useState<IStockTransaction[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [total, setTotal] = useState(0);
    const [deleteTransactionModal, setDeleteTransactionModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<IStockTransaction | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<IStockTransaction | null>(null);
    const pageSize = 10;

    function handleOpenClientModal(action:string, client: any){
        setClientModal(true)
        setAction(action)
    }

    function handleOpenDuplicateModal(transaction: IStockTransaction){
        setSelectedTransaction({
            ...transaction,
            purchased_date: ""
        });
        setClientModal(true);
        setAction("create");
    }

    function handleOpenEditModal(transaction: IStockTransaction){
        setSelectedTransaction(transaction);
        setClientModal(true);
        setAction("edit");
    }
    function handleCloseClientModal(){
        setClientModal(false)
    }

    async function handleStockTransactions(page: number, pageSize: number, query: string, supplierId: string){
        const transactions = await getStockTransactions(page, pageSize, query, supplierId);
        setStockTransactions(transactions.data.stockTransactions);
        setTotal(transactions.data.total);
    }

    const handleSupplierChange = (supplierId: string) => {
        setSupplierId(supplierId);
        setPage(1);
        handleStockTransactions(1, pageSize, query, supplierId);
    }

    const handleOpenConfirmPopUp = (transaction: IStockTransaction) => {
        setDeleteTransactionModal(true);
        setCurrentTransaction(transaction);
    }

    const handleDeleteStockTransaction = async () => {
        const id = currentTransaction?.id as string;
        await deleteStockTransaction(id);
        handleStockTransactions(page, pageSize, query, supplierId);
        setDeleteTransactionModal(false);
    }

    useEffect(() => {
        handleStockTransactions(page, pageSize, query, supplierId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(1);
            handleStockTransactions(1, pageSize, query, supplierId);
        }, 350);
        return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const columns: ColumnDef<IStockTransaction>[] = [
        {
            key: 'product',
            header: 'Produto',
            width: '15%',
            render: (transaction) => (
                <span
                    onClick={() => navigate(`/backoffice/estoque/produto/${transaction.storeProduct?.id}`)}
                    style={{ color: 'var(--dt-accent)', fontWeight: 700, cursor: 'pointer' }}
                >
                    {transaction.storeProduct?.product?.name}
                </span>
            ),
        },
        {
            key: 'quantity',
            header: 'Qtd',
            sortable: true,
            sortValue: (transaction) => transaction.quantity,
            render: (transaction) => transaction.quantity,
        },
        {
            key: 'unity',
            header: 'Unidade',
            render: (transaction) => transaction.unity,
        },
        {
            key: 'unity_price',
            header: 'Preço Unit',
            sortable: true,
            sortValue: (transaction) => transaction.unity_price,
            render: (transaction) => convertMoney(transaction.unity_price),
        },
        {
            key: 'total_price',
            header: 'Preço Total',
            sortable: true,
            sortValue: (transaction) => transaction.total_price,
            render: (transaction) => convertMoney(transaction.total_price),
        },
        {
            key: 'sale_price',
            header: 'Preço Venda',
            render: (transaction) => (
                transaction.storeProduct?.price
                    ? <span style={{ color: 'var(--dt-good-fg)', fontWeight: 600 }}>{convertMoney(transaction.storeProduct.price)}</span>
                    : <span style={{ color: 'var(--dt-ink-faint)' }}>—</span>
            ),
        },
        {
            key: 'supplier',
            header: 'Fornecedor',
            render: (transaction) => (
                transaction.supplierRelation?.id ? (
                    <span
                        onClick={() => window.open(`/backoffice/estoque/fornecedor/${transaction.supplierRelation?.id}`, '_blank')}
                        style={{ color: 'var(--dt-accent)', fontWeight: 700, cursor: 'pointer' }}
                    >
                        {transaction.supplier}
                    </span>
                ) : (
                    transaction.supplier
                )
            ),
        },
        {
            key: 'purchased_date',
            header: 'Data compra',
            sortable: true,
            sortValue: (transaction) => new Date(transaction.purchased_date).getTime(),
            render: (transaction) => moment(transaction.purchased_date).format("DD/MM/YYYY"),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (transaction) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar registro" onClick={() => handleOpenEditModal(transaction)}>
                        <FontAwesomeIcon icon={faPen}/>
                    </IconButton>
                    <IconButton $tone="duplicate" title="Duplicar registro" onClick={() => handleOpenDuplicateModal(transaction)}>
                        <FontAwesomeIcon icon={faCopy}/>
                    </IconButton>
                    <IconButton $tone="delete" title="Deletar registro" onClick={() => handleOpenConfirmPopUp(transaction)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return(
        <Container>
            <PageHeader>
                <h1>Estoque</h1>

                <AddButton onClick={() => {
                    setSelectedTransaction(null);
                    handleOpenClientModal("create", {
                        id: "",
                        first_name: "",
                        last_name: "",
                        phone_number: ""
                    });
                }}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Registro</p>
                </AddButton>
            </PageHeader>

            <DataTable
                columns={columns}
                data={stockTransactions}
                rowKey={(transaction) => transaction.id as string}
                searchPlaceholder="Buscar por produto"
                searchValue={query}
                onSearchChange={setQuery}
                toolbarExtra={
                    <SupplierSelect
                        value={supplierId}
                        onChange={handleSupplierChange}
                        style={{ maxWidth: '250px' }}
                    />
                }
                emptyTitle="Nenhum produto encontrado"
                emptyDescription="Tente buscar por outro nome ou remova o filtro de fornecedor."
                footer={
                    <>
                        <span className="dt-count">
                            Mostrando <strong>{stockTransactions.length}</strong> de <strong>{total}</strong>
                        </span>
                        <Pagination
                            currentPage={page}
                            total={total as number}
                            pageSize={pageSize as number}
                            onPageChange={setPage}
                        />
                    </>
                }
            />

            <StockTransactionModal
                isOpen={clientModalModal}
                onRequestClose={handleCloseClientModal}
                loadData={() => handleStockTransactions(page, pageSize, query, supplierId)}
                action={action}
                currentTransaction={selectedTransaction}
            />
            <ConfirmPopUp isOpen={deleteTransactionModal}
                onRequestClose={() => setDeleteTransactionModal(false)}
                handleAction={handleDeleteStockTransaction}
                actionLabel="Tem certeza que quer deletar?"
                label="Remover Registro"
            />
        </Container>
    )
}
