import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    height: 60px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1);

    img {
        width: 100px;
        height: 50px;
    }
`;

export const MenuButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;

    span {
        margin-left: 10px;
        font-size: 16px;
        font-weight: bold;
    }
`;