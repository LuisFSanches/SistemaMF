import styled from "styled-components";

export const Container = styled.form`
    h2 {
        font-size: 20px;
    }
    p {
        font-size: 18px;
        margin-top: 10px;
        line-height: 24px;
    }
`;

export const ActionButtons = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 20px;

    button {
        padding: 10px 5px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: bold;
        color: white;
    }

    .write-message {
        background: #e7b7c2;
    }

    .no-message {
        background: #50C878;
    }
`;