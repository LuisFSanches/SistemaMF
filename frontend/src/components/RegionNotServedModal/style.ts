import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 8px 16px 16px;
    gap: 12px;
`;

export const IconWrapper = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #FEE2E2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #EF4444;
    font-size: 28px;
    margin-bottom: 4px;
`;

export const Title = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #111827;
    margin: 0;
`;

export const Message = styled.p`
    font-size: 15px;
    color: #6B7280;
    margin: 0;
    line-height: 1.5;

    &.sub {
        font-size: 13px;
        color: #9CA3AF;
    }
`;

export const WhatsAppButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px;
    background: #25D366;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    margin-top: 4px;

    &:hover {
        background: #1ebe5d;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    }

    svg {
        font-size: 22px;
    }
`;

export const CloseLink = styled.button`
    background: none;
    border: none;
    color: #9CA3AF;
    font-size: 14px;
    cursor: pointer;
    text-decoration: underline;
    padding: 4px;

    &:hover {
        color: #6B7280;
    }
`;
