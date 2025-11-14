import styled from 'styled-components';

export const Container = styled.div`
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const StatusBadge = styled.span<{ status: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;

    ${props => props.status === 'Pago' && `
        background-color: #d1fae5;
        color: #065f46;
    `}

    ${props => props.status === 'Pendente' && `
        background-color: #fee2e2;
        color: #991b1b;
    `}

    ${props => props.status === 'Vencido' && `
        background-color: #fef3c7;
        color: #92400e;
    `}
`;

export const TypeBadge = styled.span<{ type: string }>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: #dbeafe;
    color: #1e40af;
`;

export const ActionsContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;

    p {
        margin-top: 0.5rem;
        font-size: 0.875rem;
    }
`;
