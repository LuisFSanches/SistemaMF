import { useState, useEffect } from 'react';
import { listCoupons, deleteCoupon } from '../../services/couponService';
import { ICoupon, CouponStatus } from '../../interfaces/coupon';
import { CouponModal } from '../../components/CouponModal';
import { GenerateCoupon } from '../../components/GenerateCoupon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faPrint } from '@fortawesome/free-solid-svg-icons';
import {
    Container,
    ButtonsContainer,
    AddButton,
    FilterToggleContainer,
    FilterButton,
    StatusBadge,
    EmptyState,
    UsageContainer,
    UsageText,
    UsageBar,
    UsageFill
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

    const getUsagePercentage = (current: number, limit: number | null): number => {
        if (!limit) return 0;
        return (current / limit) * 100;
    };

    const getUsageColor = (percentage: number): string => {
        if (percentage >= 80) return '#f44336'; // Red
        if (percentage >= 50) return '#ff9800'; // Orange
        return '#4caf50'; // Green
    };

    return (
        <Container>
            <PageHeader>
                <div>
                    <h1>🎁 Cupons de Desconto</h1>
                    <input 
                        type="text"
                        placeholder="Buscar por código do cupom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '310px' }}
                    />
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

            {loading ? (
                <EmptyState>
                    <div style={{ fontSize: '3rem' }}>⏳</div>
                    <h3>Carregando...</h3>
                </EmptyState>
            ) : coupons.length === 0 ? (
                <EmptyState>
                    <div style={{ fontSize: '4rem' }}>🎁</div>
                    <h3>Nenhum cupom encontrado</h3>
                    <p>Crie seu primeiro cupom de desconto para começar!</p>
                    <AddButton onClick={handleOpenCreateModal}>
                        <FontAwesomeIcon icon={faPlus} />
                        Criar Primeiro Cupom
                    </AddButton>
                </EmptyState>
            ) : (
                <table className="responsive-table">
                    <thead className="head">
                        <tr>
                            <th>Código</th>
                            <th>Desconto</th>
                            <th>Validade</th>
                            <th>Uso</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => {
                            const discount = formatDiscount(coupon);
                            const usagePercentage = getUsagePercentage(
                                coupon.current_usage_count, 
                                coupon.total_usage_limit ?? null
                            );
                            
                            return (
                                <tr key={coupon.id}>
                                    <td data-label="Código">
                                        <strong style={{ 
                                            color: '#EC4899', 
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {coupon.code}
                                        </strong>
                                    </td>
                                    <td data-label="Desconto">
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem',
                                            justifyContent: 'center'
                                        }}>
                                            <span>{discount.emoji}</span>
                                            <span>{discount.value}</span>
                                        </div>
                                    </td>
                                    <td data-label="Validade">
                                        {isNeverExpires(coupon) ? (
                                            <span style={{ 
                                                background: '#4caf50', 
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                fontWeight: '500'
                                            }}>
                                                ♾️ Nunca expira
                                            </span>
                                        ) : (
                                            <span>{formatDateRange(coupon)}</span>
                                        )}
                                    </td>
                                    <td data-label="Uso">
                                        <UsageContainer>
                                            <UsageText>
                                                {coupon.current_usage_count} / {coupon.total_usage_limit || '∞'}
                                            </UsageText>
                                            {coupon.total_usage_limit && (
                                                <UsageBar>
                                                    <UsageFill 
                                                        percentage={usagePercentage}
                                                        color={getUsageColor(usagePercentage)}
                                                    />
                                                </UsageBar>
                                            )}
                                        </UsageContainer>
                                    </td>
                                    <td data-label="Status">
                                        <StatusBadge status={coupon.computedStatus || 'DISABLED'}>
                                            {getStatusLabel(coupon.computedStatus as CouponStatus)}
                                        </StatusBadge>
                                    </td>
                                    <td data-label="Ações" className="table-icon">
                                        <button
                                            className="edit-button"
                                            onClick={() => handleOpenEditModal(coupon)}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                        <button
                                            className="print-button"
                                            onClick={() => handleOpenPrintModal(coupon)}
                                        >
                                            <FontAwesomeIcon icon={faPrint} />
                                        </button>
                                        <button
                                            className="del-button"
                                            onClick={() => handleDelete(coupon.id, coupon.code)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

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
        </Container>
    );
}
