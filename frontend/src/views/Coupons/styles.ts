import styled from 'styled-components';

export const Container = styled.div`
    flex: 5;
    padding: 0.8rem 2rem;

    @media (max-width:750px) {
        padding: 0.4rem;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: column;
    }
`;

export const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #EC4899;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    svg {
        font-size: 1.125rem;
    }
`;

export const FilterToggleContainer = styled.div`
    display: flex;
    gap: 0.5rem;
    background-color: #f3f4f6;
    padding: 0.25rem;
    border-radius: 0.5rem;

    @media (max-width: 768px) {
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
    }
`;

export const FilterButton = styled.button<{ active: boolean }>`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    ${props => props.active ? `
        background-color: #e7b7c2;
        color: white;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        font-weight: bold;
    ` : `
        background-color: #F4E5E8;
        color: #000000;

        &:hover {
            color: var(--text-color);
        }
    `}
`;

export const StatusBadge = styled.span<{ status: string }>`
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 500;
    background: ${props => {
        switch(props.status) {
            case 'ACTIVE': return '#4caf50';
            case 'DISABLED': return '#9e9e9e';
            case 'EXPIRED': return '#f44336';
            case 'NOT_STARTED': return '#ff9800';
            case 'USAGE_LIMIT_REACHED': return '#2196f3';
            default: return '#757575';
        }
    }};
    color: white;
`;

export const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    color: #999;

    h3 {
        margin: 1rem 0 0.5rem 0;
        color: #555;
    }

    p {
        margin-bottom: 1.5rem;
        color: #777;
    }
`;

export const UsageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
`;

export const UsageText = styled.span`
    font-size: 0.9rem;
    color: #555;
    font-weight: 500;
`;

export const UsageBar = styled.div`
    width: 80px;
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
`;

export const UsageFill = styled.div<{ percentage: number; color: string }>`
    height: 100%;
    width: ${props => props.percentage}%;
    background-color: ${props => props.color};
    border-radius: 3px;
    transition: all 0.3s ease;
`;
