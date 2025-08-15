import styled from "styled-components";

export const Container = styled.form`
    p {
        font-size: 18px;
        margin: 15px 0;
        line-height: 24px;
    }
`;

export const WhatsappButton = styled.a `
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    font-size: 18px;
    background: #25d366;
    color: white;
    cursor: pointer;
    padding: 10px;
    border-radius: 15px;
    margin-top: 10px;
    font-weight: 700;
    text-decoration: none;

    svg {
        margin-right: 10px;
        font-size: 25px;
    }
`