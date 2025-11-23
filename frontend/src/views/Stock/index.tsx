import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
import { ConfirmPopUp } from "../../components/ConfirmPopUp";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { convertMoney } from "../../utils";
import { Container } from "./style";
import { AddButton, PageHeader } from "../../styles/global";
import { StockTransactionModal } from "../../components/StockTransactionModal";
import { Pagination } from "../../components/Pagination";
import { getStockTransactions, deleteStockTransaction } from "../../services/stockTransactionService";
import { IStockTransaction } from "../../interfaces/IStockTransaction";

export function StockPage(){
    const navigate = useNavigate();
    const [clientModalModal, setClientModal] = useState(false);
    const [action, setAction] = useState("");
    const [stockTransactions, setStockTransactions] = useState<IStockTransaction[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState(0);
    const [deleteTransactionModal, setDeleteTransactionModal] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<IStockTransaction | null>(null);
    const pageSize = 15;

    function handleOpenClientModal(action:string, client: any){
        setClientModal(true)
        setAction(action)
    }
    function handleCloseClientModal(){
        setClientModal(false)
    }

    async function handleStockTransactions(page: number, pageSize: number, query: string){
        const transactions = await getStockTransactions(page, pageSize, query);
        setStockTransactions(transactions.data.stockTransactions);
        setTotal(transactions.data.total);
    }

    const searchTransactions = (query: string) => {
        setQuery(query);
        setPage(1);
        handleStockTransactions(page, pageSize, query);
    }

    const resetSearch = (query: string) => {
        if (query === '') {
            setQuery('');
            setPage(1);
            handleStockTransactions(page, pageSize, '');
        }
    }

    const handleOpenConfirmPopUp = (transaction: IStockTransaction) => {
        setDeleteTransactionModal(true);
        setCurrentTransaction(transaction);
    }

    const handleDeleteStockTransaction = async () => {
        const id = currentTransaction?.id as string;
        await deleteStockTransaction(id);
        handleStockTransactions(page, pageSize, query);
        setDeleteTransactionModal(false);
    }

    useEffect(() => {
        handleStockTransactions(page, pageSize, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return(
        <Container>
            <PageHeader>
                <h1>Estoque</h1>
                <div>
                    <input
                        style={{width: '250px'}}
                        type="text"
                        placeholder="Buscar por Produto/Fornecedor"
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                searchTransactions(e.target.value);
                            }
                        }}
                        onChange={(e) => resetSearch(e.target.value)}
                    />
                </div>
                <Pagination
                    currentPage={page}
                    total={total as number}
                    pageSize={pageSize as number}
                    onPageChange={setPage}
                />

                <AddButton onClick={() =>handleOpenClientModal("create", {
                    id: "",
                    first_name: "",
                    last_name: "",
                    phone_number: ""
                })}>
                    <FontAwesomeIcon icon={faPlus}/>
                    <p>Novo Registro</p>
                </AddButton>
            </PageHeader>
            
            <table>
                <thead className="head">
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Unidade</th>
                        <th>Preço Unit</th>
                        <th>Preço Total</th>
                        <th>Fornecedor</th>
                        <th>Data compra</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    {stockTransactions?.map(transaction => (
                        <tr key={transaction.id}>
                            <td>
                                <span 
                                    onClick={() => navigate(`/backoffice/estoque/produto/${transaction.product?.id}`)}
                                    style={{ color: 'rgb(236, 72, 153)', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    {transaction.product?.name}
                                </span>
                            </td>
                            <td>{transaction.quantity}</td>
                            <td>{transaction.unity}</td>
                            <td>{convertMoney(transaction.unity_price)}</td>
                            <td>{convertMoney(transaction.total_price)}</td>
                            <td>{transaction.supplier}</td>
                            <td>{moment(transaction.purchased_date).format("DD/MM/YYYY")}</td>
                            <td className="delete-icon">
                                <button onClick={() => handleOpenConfirmPopUp(transaction)}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <StockTransactionModal
                isOpen={clientModalModal}
                onRequestClose={handleCloseClientModal}
                loadData={() => handleStockTransactions(page, pageSize, '')}
                action={action}
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
