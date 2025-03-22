import styled from 'styled-components'

export const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 20px 0;
`;

export const PageButton = styled.button<{ active?: boolean }>`
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: ${({ active }) => (active ? 'var(--sideBarBackground)' : '#f4dfe3')};
    color: ${({ active }) => (active ? '#201E1F' : '#201E1F')};

    &:hover {
        background-color: var(--sideBarBackground);
        color: #201E1F;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;
