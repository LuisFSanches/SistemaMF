import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    position: fixed;
    top: 5px;
    right: 0;
`;

export const AlertContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background: #DDFFE9;
    border: 2px solid #84998B;
    border-radius: 15px;
    padding: 15px;

    .message-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    span {
        margin-bottom: 5px;
    }

    button {
        position: absolute;
        top: 5px;
        right: 12px;
        background: none;
        border: none;
        font-size: 23px;
    }
`;