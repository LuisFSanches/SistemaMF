import styled from "styled-components";

export const Button = styled.button`
    padding: 8px 16px;
    background: white;
    color: #505050;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
        background: #eeeeee;
    }

    svg {
        margin-right: 8px;
    }
`;