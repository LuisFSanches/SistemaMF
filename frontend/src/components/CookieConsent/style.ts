import styled from "styled-components";

export const ConsentOverlay = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;

    @keyframes slideIn {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        bottom: 0;
        right: 0;
        left: 0;
        padding: 16px;
    }
`;

export const ConsentContainer = styled.div`
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    padding: 24px;
    width: 380px;
    max-width: 100%;
    border: 1px solid var(--border-color, #e5e7eb);

    @media (max-width: 768px) {
        width: 100%;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    }
`;

export const ConsentContent = styled.div`
    margin-bottom: 20px;
`;

export const ConsentTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color, #1f2937);
    margin: 0 0 12px 0;
    font-family: 'Ubuntu', sans-serif;
`;

export const ConsentText = styled.p`
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary, #6b7280);
    margin: 0;
`;

export const ConsentLink = styled.a`
    color: var(--primary-color, #e63b7a);
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.2s;

    &:hover {
        color: var(--primary-dark, #d6336e);
    }
`;

export const ConsentButton = styled.button`
    width: 100%;
    background: linear-gradient(135deg, var(--primary-color, #e63b7a) 0%, var(--primary-light, #ea5a8f) 100%);
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 12px rgba(230, 59, 122, 0.25);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(230, 59, 122, 0.35);
    }

    &:active {
        transform: translateY(0);
    }
`;
