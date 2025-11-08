import styled from "styled-components";

export const Container = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        font-size: 22px;
    }
`;

export const DeleteButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-size: 18px;
    background: red;
    color: white;
    cursor: pointer;
    padding: 10px;
    border-radius: 15px;
    margin-top: 10px;
    font-weight: 700;
`;