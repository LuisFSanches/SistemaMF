import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ModalContainer } from '../../styles/global';
import { Pagination } from '../Pagination';
import { Loader } from '../Loader';
import { getCouponUsageHistory } from '../../services/couponService';
import { ICoupon, ICouponUsageHistory } from '../../interfaces/coupon';

interface CouponOrdersModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    coupon: ICoupon | null;
}

const PAGE_SIZE = 10;

export function CouponOrdersModal({ isOpen, onRequestClose, coupon }: CouponOrdersModalProps) {
    const [history, setHistory] = useState<ICouponUsageHistory[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [showLoader, setShowLoader] = useState(false);

    const loadHistory = async (couponId: string, currentPage: number) => {
        setShowLoader(true);
        try {
            const response = await getCouponUsageHistory(couponId, currentPage, PAGE_SIZE);
            setHistory(response.data.history || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Failed to load coupon usage history:', error);
            alert('Erro ao carregar pedidos do cupom');
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        if (isOpen && coupon) {
            setPage(1);
            loadHistory(coupon.id, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, coupon]);

    useEffect(() => {
        if (isOpen && coupon) {
            loadHistory(coupon.id, page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="react-modal-overlay"
            className="react-modal-content-medium"
        >
            <Loader show={showLoader} />
            <button type="button" onClick={onRequestClose} className="modal-close">
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <ModalContainer>
                <h2>🧾 Pedidos com o cupom {coupon?.code}</h2>

                {history.length === 0 && !showLoader ? (
                    <p>Nenhum pedido utilizou este cupom ainda.</p>
                ) : (
                    <table className="responsive-table">
                        <thead className="head">
                            <tr>
                                <th>Código</th>
                                <th>Cliente</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="Código">
                                        <Link
                                            to={`/backoffice/pedido/${item.order.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="order-code-link"
                                        >
                                            #{item.order.code}
                                        </Link>
                                    </td>
                                    <td data-label="Cliente">
                                        {item.customer.first_name} {item.customer.last_name}
                                    </td>
                                    <td data-label="Total">
                                        {Number(item.order.total).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {total > PAGE_SIZE && (
                    <Pagination
                        currentPage={page}
                        total={total}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                )}
            </ModalContainer>
        </Modal>
    );
}
