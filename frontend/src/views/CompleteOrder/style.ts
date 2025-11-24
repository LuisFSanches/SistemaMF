import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 98vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;
    padding-left: 7px;

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
    margin-top: 30px;
    border-radius: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    background: #FFFFFF;

    .spacer {
        width: 100%;
        height: 30px;
        background: #f7f2f2;
        padding: 7px;
    }

    .client-container-title {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 10px;
        font-size: 22px;
        font-weight: bold;
        background: linear-gradient(
            135deg,
            rgba(255, 230, 240, 0.7),
            #faf6ff
        );
    }

    ::-webkit-scrollbar {
        width: 8px;
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

    @media (max-width:768px){
        width: 100%;
        height: 100%;
        margin-top: 0px;
        border-radius: 0px;
    }
`

export const FormHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f7f2f2;
    padding-bottom: 20px;
    padding-top: 10px;

    img {
        width: 70px;
        height: 70px;
        background: white;
        border-radius: 50%;
        box-shadow: 
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    p {
        font-size: 23px;
        font-style: italic;
        font-family: 'Montserrat', sans-serif;
        margin-top: 8px;
    }

    span {
        font-style: italic;
        padding-bottom: 3px;
    }
`
export const CompletedOrder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 20px;

    img {
        width: 100px;
        height: 100px;
        background: white;
        border-radius: 50%;
        box-shadow: 
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

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

export const OrderReview = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #E0DAD8;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 15px;

    div {
        align-self: flex-start;
    }

    .order-info-container {
        width: 100%;
        padding: 15px;
    }

    .description-container {
        margin-bottom: 20px;
        border-bottom: 1px solid #E0DAD8;

        p {
            margin: 5px 0;
        }

        strong {
            font-size: 14px;
        }

        .observation {
            margin-top: 10px;
            padding-bottom: 10px;
        }
    }

    .price-container {
        p {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
        }

        .discount-value {
            color: #EC4899;
        }

        .total-value {
            border-top: 1px solid #E0DAD8;
            padding-top: 10px;
            color: #EC4899;
            font-weight: bold;
        }
    }

    strong, p {
        color: #6B6B6B;
        font-size: 16px;
    }

    strong {
        color: #8C737B;
    }

    h1 {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 10px;
        font-size: 22px;
        background: linear-gradient(
            135deg,
            rgba(255, 230, 240, 0.7),
            #faf6ff
        );
    }
`