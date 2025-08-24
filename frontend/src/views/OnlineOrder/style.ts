import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;
    margin-top: 10px;

    @media (max-width:1450px){
        overflow-y: scroll;
    }
`

export const NewOrderContainer = styled.div`
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: space-between;

    @media (max-width: 850px) {
        flex-direction: column;
    }
`;

export const OrderInformation = styled.div`

`;

export const ProductList = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 24px;

    @media (max-width: 1820px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 1580px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 1350px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
    }

    @media (max-width: 850px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const Form = styled.form`
    width: 530px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 20px;
    box-shadow: 0.1rem 0.2rem 0.2rem var(--shadow-color);
`
export const ProductContainer = styled.div`
    max-height: 850px;
    margin-top: 20px;
    margin-left: 15px;
    overflow-y: scroll;
    overflow-x: hidden;

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #fcc5d0;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
    }
`

export const NewProductButton = styled.button`
    padding: 10px;
    border-radius: 10px;
    background: #EC4899 !important;
    color: white !important;
    font-weight: bold;
`

export const OrderDetail = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .order-detail-container {
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0.1rem 0.2rem 0.2rem var(--shadow-color);

        p {
            font-size: 18px;
            line-height: 24px;
            margin: 15px 0;
        }

        button {
            background: none;
            margin-left: 10px;
        }

        .copied-message {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        .instruction-message {
            color: red;
        }
    }
`
export const PageHeaderActions = styled.div`
    display: flex;
`;
