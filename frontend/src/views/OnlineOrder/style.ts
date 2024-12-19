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