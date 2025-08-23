import styled from "styled-components";

export const Container = styled.div`
    display: inline-block;
    margin-right: 15px;
`;

export const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    h2 {
        color: var(--text-title)
    }
`;

export const TextArea = styled.textarea`
    width: 100%;
    height: 300px;
    padding: 8px;
    border: 1px solid #e7b7c2;
    border-radius: 4px;
    resize: none;
    outline: none;
    font-size: 15px;
`;

export const Button = styled.button`
    padding: 8px 16px;
    background: #66c1df;
    color: white;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

    &:hover {
        opacity: 0.8;
    }

    svg {
        margin-right: 8px;
    }
`;