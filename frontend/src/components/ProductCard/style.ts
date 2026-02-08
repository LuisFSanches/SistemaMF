import styled from "styled-components";

export const Card = styled.div<{ clickable?: boolean }>`
    width: 220px;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    background: #fff;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
    transition: all 0.3s ease;

    &:hover {
        border-color: #EC4899;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        width: 100%;
    }
        
`;

export const ClickableArea = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ProductImage = styled.img`
    width: 100%;
    height: 100px;
    object-fit: contain;
    margin-top: 12px;
`;

export const Info = styled.div`
    padding: 0 16px 16px;

    @media (max-width: 768px) {
        padding: 0 12px 12px;
    }
`;

export const ProductName = styled.h3`
    min-height: 42px;
    font-size: 16px;
    margin: 0 0 8px;
    padding: 0 16px;
    margin-top: 8px;

    @media (max-width: 768px) {
        font-size: 14px;
        min-height: 36px;
    }
`;

export const PriceInputWrapper = styled.div`
    position: relative;
    display: inline-block;
    width: 100%;
    padding: 0 16px;
`;

export const PriceInput = styled.input`
    font-size: 1rem;
    font-weight: bold;
    color: #EC4899;
    padding-left: 30px; /* Espaço para o $ */
    margin-bottom: 12px;
    width: 100%;
`;

export const PriceDisplay = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    color: #EC4899;
    margin-bottom: 12px;
    padding: 0 16px;
`;

export const MoneySign = styled.span`
    position: absolute;
    top: 22px;
    left: 22px;
    transform: translateY(-50%);
    color: #EC4899;
    font-size: 1rem;
    font-weight: bold;
    pointer-events: none;
`;

export const QuantityInput = styled.input`
    width: 60px;
    padding: 6px;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    text-align: center;
`;

export const AddButton = styled.button`
    padding: 8px 12px;
    background-color: #EC4899 !important;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 0px !important;
    font-weight: bold;

`;

export const BottomActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 8px;
    }
`;
