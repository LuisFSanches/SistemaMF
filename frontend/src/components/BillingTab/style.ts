import styled from 'styled-components';

export const BillingContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    padding: 2rem 0;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 1rem 0;
        gap: 1.5rem;
    }
`;

export const BillingCard = styled.div<{ fullWidth?: boolean }>`
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    grid-column: ${({ fullWidth }) => fullWidth ? '1 / -1' : 'auto'};
`;

export const CardHeader = styled.div`
    background: linear-gradient(135deg, var(--primary-color), #ec4899);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
        color: white;
        font-size: 1.5rem;
    }

    h3 {
        color: white;
        font-size: 1.3rem;
        margin: 0;
    }
`;

export const CardContent = styled.div`
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1.5rem;
    }
`;

export const PlanInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1.5rem 0;
`;

export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
`;

export const InfoLabel = styled.span`
    color: var(--text-light);
    font-size: 1rem;
    font-weight: 500;
`;

export const InfoValue = styled.span`
    color: var(--text-body);
    font-size: 1.1rem;
    font-weight: 600;
`;

export const StatusBadge = styled.div<{ color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: ${({ color }) => `${color}15`};
    color: ${({ color }) => color};
    border: 2px solid ${({ color }) => color};
    border-radius: 2rem;
    font-weight: 600;
    font-size: 0.9rem;

    svg {
        font-size: 1rem;
    }
`;

export const NextBillHighlight = styled.div`
    background: linear-gradient(135deg, #FEF3C7, #FDE68A);
    border: 2px solid #F59E0B;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin: 1rem 0;

    .total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;

        span {
            font-size: 1.1rem;
            color: #92400E;
        }

        strong {
            font-size: 1.8rem;
            color: #B45309;
        }
    }

    .due-date {
        text-align: center;
        font-size: 0.95rem;
        color: #92400E;
        font-weight: 500;
    }
`;

export const BillBreakdown = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin: 1.5rem 0;
`;

export const BreakdownItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--light-background);
    border-radius: 0.5rem;

    span {
        color: var(--text-title);
        font-size: 0.95rem;
    }

    strong {
        color: var(--text-body);
        font-size: 1.05rem;
    }
`;

export const BillingTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
`;

export const TableHeader = styled.thead`
    background: var(--light-background);
`;

export const TableBody = styled.tbody`
    tr:nth-child(even) {
        background: #fafafa;
    }
`;

export const TableRow = styled.tr`
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
        border-bottom: none;
    }
`;

export const TableCell = styled.td`
    padding: 1rem;
    text-align: center;
    color: var(--text-body);
    font-size: 1rem;

    &:first-child {
        text-align: left;
        font-weight: 600;
    }
`;

export const ActionButton = styled.button`
    width: 100%;
    padding: 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 1.5rem;

    &:hover:not(:disabled) {
        background: #d14766;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(233, 85, 120, 0.3);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
`;

export const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    color: var(--text-light);

    svg {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: var(--text-light);
    }

    p {
        font-size: 1.1rem;
    }
`;
