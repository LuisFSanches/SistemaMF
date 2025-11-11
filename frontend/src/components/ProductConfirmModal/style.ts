import styled from "styled-components";

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;

    h2 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0;
    }
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    color: #666;
    cursor: pointer;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    &:hover {
        color: #333;
    }
`;

export const ModalBody = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

export const ProductInfo = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
`;

export const ProductImageBox = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const ProductDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0 0 10px 0;
    }

    p {
        font-size: 14px;
        color: #666;
        margin: 5px 0;
    }
`;

export const InputGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 500px) {
        grid-template-columns: 1fr;
    }
`;

export const Label = styled.label`
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.2s;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    &:disabled {
        background: #f5f5f5;
        cursor: not-allowed;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 30px;
    justify-content: flex-end;

    @media (max-width: 500px) {
        flex-direction: column;
    }
`;

export const ConfirmButton = styled.button`
    padding: 12px 24px;
    background-color: #EC4899;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.9;
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const CancelButton = styled.button`
    padding: 12px 24px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.9;
    }

    &:active {
        transform: scale(0.98);
    }
`;
