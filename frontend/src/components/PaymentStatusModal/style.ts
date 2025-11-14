import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .order-info {
        margin-bottom: 20px;
        padding: 15px;
        background: var(--background);
        border-radius: 8px;
        border: 1px solid var(--primary-color);
        width: 100%;

        p {
            margin: 5px 0;
            font-size: 1rem;
        }

        .warning {
            font-weight: 600;
            color: var(--text-body);
            margin-top: 10px;
        }
    }

    .question {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-title);
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    width: 100%;
    margin-top: 20px;
`;

export const ActionButton = styled.button`
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;

    &.confirm-payment {
        background-color: #EC4899;
        color: white;

        &:hover {
            background-color: #EC4899;
        }
    }

    &.create-order {
        background-color: var(--blue);
        color: white;

        &:hover {
            background-color: #2f6cb7;
        }
    }

    &.cancel {
        background-color: var(--text-light);
        color: white;

        &:hover {
            background-color: #828282;
        }
    }
`;

export const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    position: relative;

    button {
        font-size: 1.5rem;
        position: absolute;
        left: 0;
        background: none;
        color: var(--text-title);
    }

    h3 {
        width: 100%;
        color: var(--text-title);
        text-align: center;
    }
`