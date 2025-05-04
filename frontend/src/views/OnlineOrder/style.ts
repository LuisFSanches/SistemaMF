import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;

    @media (max-width:1450px){
        overflow-y: scroll;
    }

    @media (max-width: 768px) {
        height: 100vh;
    }
`

export const Form = styled.form`
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 20px;
    box-shadow: 0.1rem 0.2rem 0.2rem var(--shadow-color);
`

export const FormHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: #e7b7c2;
    font-size: 18px;

    h2 {
        margin-left: 10px;
    }
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