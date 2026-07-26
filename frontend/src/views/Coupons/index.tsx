import { useState, useEffect } from 'react';
import { listCoupons, deleteCoupon } from '../../services/couponService';
import { ICoupon, CouponStatus } from '../../interfaces/coupon';
import { CouponModal } from '../../components/CouponModal';
import { GenerateCoupon } from '../../components/GenerateCoupon';
import { CouponOrdersModal } from '../../components/CouponOrdersModal';
import { DataTable, ColumnDef } from '../../components/DataTable';
import { RowActions, IconButton } from '../../components/DataTable/style';
import { Badge, BadgeTone } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faPrint, faReceipt } from '@fortawesome/free-solid-svg-icons';
import {
    Container,
    ButtonsContainer,
    AddButton,
    FilterToggleContainer,
    FilterButton,
} from './styles';
import { PageHeader } from '../../styles/global';
import moment from 'moment';

export function Coupons() {
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | CouponStatus>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState<'create' | 'edit'>('create');
    const [currentCoupon, setCurrentCoupon] = useState<ICoupon | null>(null);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [couponToPrint, setCouponToPrint] = useState<ICoupon | null>(null);
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
    const [couponForOrders, setCouponForOrders] = useState<ICoupon | null>(null);

    const loadCoupons = async () => {
        setLoading(true);
        try {
            const response = await listCoupons(
                1,
                50,
                filter === 'all' ? undefined : filter,
                searchTerm || undefined
            );
            setCoupons(response.data.coupons || []);
        } catch (error) {
            console.error('Failed to load coupons:', error);
            alert('Erro ao carregar cupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, searchTerm]);

    const handleOpenCreateModal = () => {
        setModalAction('create');
        setCurrentCoupon(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (coupon: ICoupon) => {
        setModalAction('edit');
        setCurrentCoupon(coupon);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCoupon(null);
    };

    const handleOpenPrintModal = (coupon: ICoupon) => {
        setCouponToPrint(coupon);
        setIsPrintModalOpen(true);
    };

    const handleClosePrintModal = () => {
        setIsPrintModalOpen(false);
        setCouponToPrint(null);
    };

    const handleOpenOrdersModal = (coupon: ICoupon) => {
        setCouponForOrders(coupon);
        setIsOrdersModalOpen(true);
    };

    const handleCloseOrdersModal = () => {
        setIsOrdersModalOpen(false);
        setCouponForOrders(null);
    };

    const handleSave = () => {
        loadCoupons();
    };

    const handleDelete = async (id: string, code: string) => {
        if (window.confirm(`Tem certeza que deseja desativar o cupom ${code}?`)) {
            try {
                await deleteCoupon(id);
                alert('Cupom desativado com sucesso');
                loadCoupons();
            } catch (error) {
                console.error('Failed to delete coupon:', error);
                alert('Erro ao desativar cupom');
            }
        }
    };

    const getStatusLabel = (status: CouponStatus) => {
        const labels: Record<CouponStatus, string> = {
            ACTIVE: 'Ativo',
            DISABLED: 'Desativado',
            EXPIRED: 'Expirado',
            NOT_STARTED: 'Não Iniciado',
            USAGE_LIMIT_REACHED: 'Limite Atingido'
        };
        return labels[status] || status;
    };

    const formatDiscount = (coupon: ICoupon) => {
        const emoji = coupon.discount_type === 'FIXED' ? '💵' : '';
        const discountValue = Number(coupon.discount_value);
        const value = coupon.discount_type === 'FIXED'
            ? `R$ ${discountValue.toFixed(2)}`
            : `${discountValue}%`;
        return { emoji, value };
    };

    const isNeverExpires = (coupon: ICoupon) => {
        const expirationDate = new Date(coupon.expiration_date);
        return expirationDate.getFullYear() >= 2099;
    };

    const formatDateRange = (coupon: ICoupon) => {
        const start = moment(coupon.start_date).format('DD/MM/YYYY');
        const end = moment(coupon.expiration_date).format('DD/MM/YYYY');
        return `${start} - ${end}`;
    };

    const getStatusTone = (status: CouponStatus): BadgeTone => {
        const tones: Record<CouponStatus, BadgeTone> = {
            ACTIVE: 'good',
            DISABLED: 'neutral',
            EXPIRED: 'bad',
            NOT_STARTED: 'warn',
            USAGE_LIMIT_REACHED: 'info',
        };
        return tones[status] || 'neutral';
    };

    const columns: ColumnDef<ICoupon>[] = [
        {
            key: 'code',
            header: 'Código',
            render: (coupon) => (
                <strong style={{ color: 'var(--dt-accent)', fontSize: '14px' }}>
                    {coupon.code}
                </strong>
            ),
        },
        {
            key: 'discount',
            header: 'Desconto',
            render: (coupon) => {
                const discount = formatDiscount(coupon);
                return (
                    <span>{discount.emoji} {discount.value}</span>
                );
            },
        },
        {
            key: 'validity',
            header: 'Validade',
            render: (coupon) => (
                isNeverExpires(coupon)
                    ? <Badge tone="info">Nunca expira</Badge>
                    : <span>{formatDateRange(coupon)}</span>
            ),
        },
        {
            key: 'usage',
            header: 'Uso',
            render: (coupon) => (
                coupon.total_usage_limit
                    ? <ProgressBar value={coupon.current_usage_count} max={coupon.total_usage_limit} />
                    : <span>{coupon.current_usage_count} / ∞</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (coupon) => (
                <Badge tone={getStatusTone(coupon.computedStatus || CouponStatus.DISABLED)}>
                    {getStatusLabel(coupon.computedStatus as CouponStatus)}
                </Badge>
            ),
        },
        {
            key: 'actions',
            header: 'Ações',
            render: (coupon) => (
                <RowActions>
                    <IconButton $tone="edit" title="Editar cupom" onClick={() => handleOpenEditModal(coupon)}>
                        <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton $tone="default" title="Imprimir cartão" onClick={() => handleOpenPrintModal(coupon)}>
                        <FontAwesomeIcon icon={faPrint} />
                    </IconButton>
                    <IconButton $tone="view" title="Ver pedidos que usaram este cupom" onClick={() => handleOpenOrdersModal(coupon)}>
                        <FontAwesomeIcon icon={faReceipt} />
                    </IconButton>
                    <IconButton $tone="delete" title="Desativar cupom" onClick={() => handleDelete(coupon.id, coupon.code)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                </RowActions>
            ),
        },
    ];

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>🎁 Cupons de Desconto</h1>
                </div>
                <ButtonsContainer>
                    <FilterToggleContainer>
                        <FilterButton
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </FilterButton>
                        <FilterButton
                            active={filter === CouponStatus.ACTIVE}
                            onClick={() => setFilter(CouponStatus.ACTIVE)}
                        >
                            Ativos
                        </FilterButton>
                        <FilterButton
                            active={filter === CouponStatus.EXPIRED}
                            onClick={() => setFilter(CouponStatus.EXPIRED)}
                        >
                            Expirados
                        </FilterButton>
                        <FilterButton
                            active={filter === CouponStatus.DISABLED}
                            onClick={() => setFilter(CouponStatus.DISABLED)}
                        >
                            Desativados
                        </FilterButton>
                    </FilterToggleContainer>
                    <AddButton onClick={handleOpenCreateModal}>
                        <FontAwesomeIcon icon={faPlus} />
                        Novo Cupom
                    </AddButton>
                </ButtonsContainer>
            </PageHeader>

            <DataTable
                columns={columns}
                data={coupons}
                rowKey={(coupon) => coupon.id}
                loading={loading}
                searchPlaceholder="Buscar por código do cupom..."
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                emptyTitle="Nenhum cupom encontrado"
                emptyDescription="Crie seu primeiro cupom de desconto para começar."
            />

            <CouponModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                onSave={handleSave}
                currentCoupon={currentCoupon}
                action={modalAction}
            />

            <GenerateCoupon
                isOpen={isPrintModalOpen}
                onRequestClose={handleClosePrintModal}
                coupon={couponToPrint}
            />

            <CouponOrdersModal
                isOpen={isOrdersModalOpen}
                onRequestClose={handleCloseOrdersModal}
                coupon={couponForOrders}
            />
        </Container>
    );
}
