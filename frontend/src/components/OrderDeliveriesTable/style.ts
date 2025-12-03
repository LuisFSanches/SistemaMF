import styled from 'styled-components';

export const Container = styled.div`
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    /* Custom checkbox styling */
    input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #d1d5db;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s;

        &:hover {
            border-color: #EC4899;
        }

        &:checked {
            background-color: #EC4899;
            border-color: #EC4899;
        }

        &:checked::after {
            content: '';
            position: absolute;
            left: 7px;
            top: 4px;
            width: 6px;
            height: 8px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
    }
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
