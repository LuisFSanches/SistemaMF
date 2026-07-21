import styled from 'styled-components';

export const StyledSelect = styled.select`
    width: 250px;
    padding: 0.65rem 1rem;
    font-size: 1rem;
    border: 1px solid #E5E7EB;
    border-radius: 0.5rem;
    background-color: white;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;

    &:focus {
        outline: none;
        border-color: #EC4899;
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }
`;
