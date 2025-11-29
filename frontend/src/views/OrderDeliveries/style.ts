import styled from 'styled-components';

export const Container = styled.div`
    height: 100vh;
    flex: 5;
    padding: 0.8rem 2rem;

    @media (max-width:750px) {
        padding: 0.4rem;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
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
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: var(--primary-hover);
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
        background-color: white;
        color: var(--primary-color);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    ` : `
        background-color: transparent;
        color: #6b7280;

        &:hover {
            color: var(--text-color);
        }
    `}
`;
