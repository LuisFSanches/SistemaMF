import styled from "styled-components";

export const HeaderImage = styled.div`
    width: 100%;
    aspect-ratio: 16 / 8.2;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

export const Container = styled.form`
    text-align: center;
    padding: 1.5rem 2rem 2rem;

    @media (max-width: 768px) {
        padding: 1.25rem 1.5rem 1.75rem;
    }

    h2 {
        font-size: 19px;
        font-weight: 600;
        line-height: 1.4;
        text-align: left;
        color: var(--text-body);
        letter-spacing: -0.01em;
    }

    p {
        font-size: 15px;
        margin-top: 10px;
        line-height: 1.6;
        text-align: left;
        color: var(--text-title);
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        margin-top: 28px;
        padding: 13px 20px;
        background: linear-gradient(135deg, var(--primary-color), #ec4899);
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.01em;
        box-shadow: 0 4px 14px rgba(233, 85, 120, 0.28);
        transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(233, 85, 120, 0.34);
            filter: brightness(1.03);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 3px 10px rgba(233, 85, 120, 0.28);
        }
    }
`;

export const SpamNotice = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;
    padding: 12px 14px;
    background-color: #f0f6ff;
    border-radius: 8px;
    text-align: left;
    font-weight: 600;

    svg {
        color: #3b82f6;
        margin-top: 3px;
        flex-shrink: 0;
        font-size: 14px;
    }

    span {
        font-size: 15px;
        line-height: 19px;
        color: #3c5a7a;
    }
`;
