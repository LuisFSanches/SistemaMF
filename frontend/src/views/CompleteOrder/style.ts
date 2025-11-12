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
    height: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    background: white;
    border-radius: 20px;
    box-shadow: 0.1rem 0.2rem 0.2rem var(--shadow-color);
    overflow-y: scroll;
    overflow-x: hidden;

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
    font-size: 18px;
    background: rgba(247,214,218,0.5);

    img {
        width: 150px;
        height: 50px;
    }

    h1 {
        font-size: 28px;
        font-family: "Parisienne", sans-serif;
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
        color: #505050;
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

    img {
        width: 225px;
        height: 80px;
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
    padding: 10px;
    background: rgba(247, 214, 218, 0.5);

    div {
        align-self: flex-start;
    }

    strong, p {
        color: #6B6B6B;
        font-size: 16px;
    }

    p {
        margin-bottom: 5px;
    }

    h1 {
        font-size: 26px;
        font-family: "Parisienne", sans-serif;
        color: #6B6B6B;
    }
`