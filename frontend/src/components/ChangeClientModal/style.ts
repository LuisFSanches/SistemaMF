import styled from "styled-components";

export const ClientList = styled.ul`
    list-style: none;
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    border-radius: 8px;

    li {
        padding: 15px;
        border-bottom: 1px solid #EC4899;
        cursor: pointer;
        transition: background-color 0.2s;
        background-color: white;
        margin-bottom: 5px;

        &:hover {
            background-color: var(--primary-color);
        }

        &:last-child {
            border-bottom: none;
        }

        &.no-results {
            text-align: center;
            color: var(--text-secondary);
            cursor: default;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            padding: 30px 15px;

            &:hover {
                background-color: transparent;
            }

            p {
                margin: 0;
            }

            button {
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
        }

        .client-info {
            display: flex;
            flex-direction: column;
            gap: 5px;

            .client-name {
                font-weight: 600;
                color: var(--text-primary);
            }

            .client-phone {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }
        }
    }
`;
