import styled from "styled-components";

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
        margin: 0;
    }
`;

export const CancelButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        background-color: #c82333;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

export const EditClientButton = styled.button`
    background: none;
    border: none;
    color: #EC4899;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    margin-top: 0px;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.7;
    }
`;
