import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #fef5f8 0%, #fff 100%);
    padding-bottom: 40px;
`;

export const Content = styled.main`
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 20px;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    > div:first-child {
        order: 2;

        @media (max-width: 1024px) {
            order: 1;
        }
    }

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

export const CartSection = styled.div`
    min-width: 450px;
    width: 100%;
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    @media (max-width: 768px) {
        min-width: auto;
    }
`;

export const SectionTitle = styled.h2`
    color: var(--primary-color);
    font-size: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const CartItem = styled.div`
    display: flex;
    gap: 16px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    margin-bottom: 16px;
    transition: all 0.3s ease;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
`;

export const CartItemImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 12px;

    @media (max-width: 768px) {
        width: 60px;
        height: 60px;
    }
`;

export const CartItemInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const CartItemName = styled.h4`
    color: #333;
    font-size: 16px;
    margin-bottom: 8px;
`;

export const CartItemPrice = styled.p`
    color: var(--primary-color);
    font-size: 18px;
    font-weight: bold;
`;

export const CartItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 4px;
`;

export const QuantityButton = styled.button`
    background: var(--primary-color);
    color: white;
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background: #d93f7c;
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
    }
`;

export const QuantityDisplay = styled.span`
    min-width: 30px;
    text-align: center;
    font-weight: 600;
`;

export const RemoveButton = styled.button`
    background: transparent;
    border: none;
    color: #ff4444;
    cursor: pointer;
    font-size: 20px;
    padding: 4px;
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.1);
        color: #cc0000;
    }
`;

export const EmptyCart = styled.div`
    text-align: center;
    padding: 60px 20px;
    color: #999;

    svg {
        font-size: 64px;
        margin-bottom: 20px;
        color: #ddd;
    }

    h3 {
        font-size: 24px;
        margin-bottom: 10px;
        color: #666;
    }

    p {
        font-size: 16px;
        margin-bottom: 24px;
    }
`;

export const OrderSummary = styled.div`
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    height: fit-content;
    position: sticky;
    top: 100px;

    @media (max-width: 1024px) {
        position: relative;
        top: 0;
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

export const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    font-size: 16px;

    &.total {
        padding-top: 16px;
        border-top: 2px solid #f0f0f0;
        font-size: 20px;
        font-weight: bold;
        color: var(--primary-color);
    }
`;

export const CheckboxContainer = styled.div<{ alignLeft?: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: ${props => props.alignLeft ? 'flex-start' : 'center'};
`;

export const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

export const FormFieldTitle = styled.h3`
    color: var(--primary-color);
    font-size: 20px;
    margin: 24px 0 16px;
    padding-top: 24px;
    border-top: 2px solid #f0f0f0;

    &:first-child {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
    }
`;

export const ProductsList = styled.div`
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 10px;
    }
`;

export const ProductItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    background: #f9f9f9;
    border-radius: 8px;
    font-size: 14px;
`;

export const ProductDetails = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`;

export const ProductName = styled.div`
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
`;

export const ProductQuantity = styled.div`
    color: #666;
    font-size: 13px;
`;

export const ProductPrice = styled.div`
    font-weight: bold;
    color: var(--primary-color);
    white-space: nowrap;
`;

export const Divider = styled.div`
    height: 1px;
    background: #e0e0e0;
    margin: 16px 0;
`;

export const CompletedOrder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 18px;


    h1, h2 {
        font-size: 27px;
        margin-top: 25px;
        text-align: center;
        color: pink;
        font-family: "Poppins", sans-serif;
        font-style: italic;
    }

    p {
        font-size: 25px;
        margin-top: 15px;
    }
`