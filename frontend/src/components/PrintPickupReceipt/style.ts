import styled from 'styled-components'

export const PrintReceiptButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 20px;
    color: #666666;
    padding: 5px;
    transition: color 0.2s;

    svg {
        width: 18px;
        height: 18px;
    }

    &:hover {
        color: var(--primary-color);
    }
`
