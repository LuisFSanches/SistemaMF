import styled from 'styled-components';

interface CardProps {
    color: string;
    isActive: boolean;
}

export const Card = styled.div<CardProps>`
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 3px solid ${props => props.isActive ? props.color : 'transparent'};
    position: relative;
    overflow: hidden;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        background: #f2efef;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: ${props => props.color};
    }

    @media (max-width: 768px) {
        padding: 16px;
    }
`;

export const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const IconWrapper = styled.div<{ color: string }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.color}20;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.color};
    font-size: 20px;

    @media (max-width: 768px) {
        width: 40px;
        height: 40px;
        font-size: 18px;
    }
`;

export const CardTitle = styled.h4`
    color: #444444;
    font-size: 20px;
    font-weight: 700;

    @media (max-width: 768px) {
        font-size: 13px;
    }
`;

export const CardValue = styled.p`
    color: var(--text-body);
    font-size: 32px;
    font-weight: 700;
    margin: 0;

    @media (max-width: 768px) {
        font-size: 28px;
    }
`;
